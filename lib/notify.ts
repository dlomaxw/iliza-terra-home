import "server-only";

/** Email the team about a new enquiry (only if RESEND_API_KEY is configured). Never throws. */
export async function notifyNewInquiry(to: string, subject: string, lines: string[]) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Iliza Terra Homes <onboarding@resend.dev>",
        to: [to],
        subject,
        text: lines.join("\n"),
      }),
    });
  } catch (e) {
    console.error("Email notification failed", e);
  }
}
