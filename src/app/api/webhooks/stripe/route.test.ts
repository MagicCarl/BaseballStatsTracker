import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { update, constructEvent, sendEmail } = vi.hoisted(() => ({
  update: vi.fn(),
  constructEvent: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: { user: { update } } }));
vi.mock("@/lib/stripe", () => ({ stripe: { webhooks: { constructEvent } } }));
vi.mock("@/lib/email", () => ({ sendPaymentThankYouEmail: sendEmail }));

import { POST } from "./route";

function checkoutEvent(paymentStatus = "paid") {
  return {
    type: "checkout.session.completed",
    data: { object: { id: "cs_1", payment_status: paymentStatus, metadata: { userId: "user_1" } } },
  };
}

const customer = (welcomeEmailSentAt: Date | null = null) => ({
  email: "coach@example.com",
  displayName: "Pat",
  welcomeEmailSentAt,
});

const post = () =>
  POST(
    new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
      headers: { "stripe-signature": "sig" },
    }),
  );

describe("Stripe webhook welcome email", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    constructEvent.mockReturnValue(checkoutEvent());
    update.mockResolvedValue(customer());
    sendEmail.mockResolvedValue(true);
  });

  it("grants access, emails the customer, and records that it was sent", async () => {
    const res = await post();

    expect(res.status).toBe(200);
    expect(update.mock.calls[0][0].data).toEqual({ isPaid: true });
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith("coach@example.com", "Pat", "welcome/cs_1");
    expect(update.mock.calls[1][0].data.welcomeEmailSentAt).toBeInstanceOf(Date);
  });

  it("does not email again once the email is recorded as sent", async () => {
    update.mockResolvedValue(customer(new Date()));

    const res = await post();

    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("keeps access but asks Stripe to retry when the email fails", async () => {
    sendEmail.mockResolvedValue(false);

    const res = await post();

    expect(res.status).toBe(500);
    expect(update.mock.calls[0][0].data).toEqual({ isPaid: true });
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("sends on the retry after a failure, with the same key", async () => {
    sendEmail.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    expect((await post()).status).toBe(500);
    expect((await post()).status).toBe(200);

    expect(sendEmail.mock.calls[0][2]).toBe("welcome/cs_1");
    expect(sendEmail.mock.calls[1][2]).toBe("welcome/cs_1");
  });

  it("asks Stripe to retry if recording the send fails", async () => {
    update.mockResolvedValueOnce(customer()).mockRejectedValueOnce(new Error("db down"));

    expect((await post()).status).toBe(500);
  });

  it("does nothing for a checkout that isn't paid yet", async () => {
    constructEvent.mockReturnValue(checkoutEvent("unpaid"));

    await post();

    expect(update).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("asks Stripe to retry if the database is down", async () => {
    update.mockRejectedValue(new Error("db down"));

    expect((await post()).status).toBe(500);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not retry for a user that doesn't exist", async () => {
    update.mockRejectedValue(Object.assign(new Error("missing"), { code: "P2025" }));

    expect((await post()).status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
