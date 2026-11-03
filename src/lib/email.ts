import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Returns true only once Resend has accepted the email. Pass an idempotencyKey
 * when the call may be retried, so a repeat can't send a second copy.
 */
export async function sendPaymentThankYouEmail(
  to: string,
  displayName: string | null,
  idempotencyKey?: string,
): Promise<boolean> {
  if (!resend) {
    console.error("RESEND_API_KEY not set; could not send thank-you email");
    return false;
  }

  const greeting = displayName ? `Hi ${displayName},` : "Hi,";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
      <h2 style="color: #1f2937; margin-bottom: 16px;">Welcome, and thank you!</h2>
      <p>${escapeHtml(greeting)}</p>
      <p>Welcome to <strong>Baseball Stats Tracker</strong>, and thank you for your purchase. You now have full access to all the features.</p>
      <p>You can sign in anytime at <a href="https://www.baseballstatstracker.com" style="color: #2563eb;">baseballstatstracker.com</a> to start tracking your team's stats.</p>
      <p style="margin-top: 24px;">Play ball!</p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">&mdash; Baseball Stats Tracker</p>
    </div>
  `;

  const text = `${greeting}

Welcome to Baseball Stats Tracker, and thank you for your purchase. You now have full access to all the features.

Sign in anytime at https://www.baseballstatstracker.com to start tracking your team's stats.

Play ball!
— Baseball Stats Tracker`;

  try {
    // Resend reports most failures in the result rather than by throwing.
    const { error } = await resend.emails.send({
      from: `Baseball Stats Tracker <${fromEmail}>`,
      to,
      subject: "Welcome to Baseball Stats Tracker, and thank you for your purchase",
      html,
      text,
    }, idempotencyKey ? { idempotencyKey } : undefined);
    if (error) {
      console.error("Failed to send thank-you email:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send thank-you email:", err);
    return false;
  }
}
