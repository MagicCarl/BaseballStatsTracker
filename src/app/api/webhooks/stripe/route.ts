import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendPaymentThankYouEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Stripe signature verification needs the raw, unparsed request body.
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // A completed, paid one-time checkout grants lifetime access.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      const userId =
        session.metadata?.userId || session.client_reference_id || null;
      if (userId) {
        try {
          const user = await prisma.user.update({
            where: { id: userId },
            data: { isPaid: true },
            select: { email: true, displayName: true, welcomeEmailSentAt: true },
          });
          console.log(`[stripe webhook] marked user ${userId} as paid`);

          // Access is granted before the email, so a mail outage can't lock out
          // a paying customer. A failed send answers 500 so Stripe retries until
          // welcomeEmailSentAt is set; the key stops a retry sending a second copy.
          if (!user.welcomeEmailSentAt) {
            const sent = await sendPaymentThankYouEmail(
              user.email,
              user.displayName,
              `welcome/${session.id}`,
            );
            if (!sent) {
              return NextResponse.json({ error: "Welcome email failed" }, { status: 500 });
            }
            await prisma.user.update({
              where: { id: userId },
              data: { welcomeEmailSentAt: new Date() },
            });
          }
        } catch (err) {
          // Retrying can't help a user that doesn't exist; anything else can.
          console.error(`[stripe webhook] could not complete checkout for ${userId}:`, err);
          if ((err as { code?: string }).code !== "P2025") {
            return NextResponse.json({ error: "Checkout processing failed" }, { status: 500 });
          }
        }
      } else {
        console.error("[stripe webhook] no userId on completed session", session.id);
      }
    }
  }

  // A refund revokes access: the user is soft-deleted and marked unpaid, so
  // they can no longer use the app (enforced by getAuthUser's deletedAt check).
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    // userId lives on the PaymentIntent metadata (set at checkout). Fall back
    // to the charge's own metadata just in case.
    let userId = charge.metadata?.userId || null;
    if (!userId && charge.payment_intent) {
      try {
        const piId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent.id;
        const pi = await stripe.paymentIntents.retrieve(piId);
        userId = pi.metadata?.userId || null;
      } catch (err) {
        console.error("[stripe webhook] could not retrieve PaymentIntent:", err);
      }
    }
    if (userId) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isPaid: false, deletedAt: new Date() },
        });
        console.log(`[stripe webhook] refund → revoked access for user ${userId}`);
      } catch (err) {
        console.error(`[stripe webhook] could not revoke ${userId}:`, err);
      }
    } else {
      console.error("[stripe webhook] no userId on refunded charge", charge.id);
    }
  }

  return NextResponse.json({ received: true });
}
