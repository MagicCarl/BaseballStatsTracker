import { beforeEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => {
  process.env.RESEND_API_KEY = "re_test";
  return { send: vi.fn() };
});

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { sendPaymentThankYouEmail } from "./email";

describe("sendPaymentThankYouEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    send.mockResolvedValue({ data: { id: "1" }, error: null });
  });

  it("sends to the customer with a welcome subject", async () => {
    await sendPaymentThankYouEmail("coach@example.com", "Pat");
    const msg = send.mock.calls[0][0];
    expect(msg.to).toBe("coach@example.com");
    expect(msg.subject).toMatch(/welcome/i);
    expect(msg.html).toContain("Hi Pat,");
    expect(msg.text).toContain("Hi Pat,");
  });

  it("escapes HTML in the display name", async () => {
    await sendPaymentThankYouEmail("coach@example.com", '<img src=x onerror="a()">');
    const msg = send.mock.calls[0][0];
    expect(msg.html).not.toContain("<img");
    expect(msg.html).toContain("&lt;img");
  });

  it("returns true once Resend accepts it, and passes the retry key along", async () => {
    await expect(sendPaymentThankYouEmail("coach@example.com", "Pat", "welcome/cs_1")).resolves.toBe(true);
    expect(send.mock.calls[0][1]).toEqual({ idempotencyKey: "welcome/cs_1" });
  });

  it("returns false and logs when Resend reports an error instead of throwing", async () => {
    send.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(sendPaymentThankYouEmail("coach@example.com", null)).resolves.toBe(false);
    expect(log).toHaveBeenCalled();
  });

  it("returns false when the send throws", async () => {
    send.mockRejectedValue(new Error("network"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(sendPaymentThankYouEmail("coach@example.com", null)).resolves.toBe(false);
  });
});
