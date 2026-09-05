/**
 * Single email-sending entry point — meant to serve both transactional
 * mail (this file's callers) and, later, The MMWA Briefing newsletter,
 * so the site never ends up with two separate provider integrations.
 *
 * Uses Resend's HTTP API directly (no SDK dependency). If RESEND_API_KEY
 * isn't configured yet, this logs instead of throwing, so the rest of the
 * subscription flow keeps working while email delivery is wired up.
 */
export async function sendTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.TRANSACTIONAL_EMAIL_FROM || "JOSEPH MMWA <notifications@josephmmwa.com>";

  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not configured — skipping send to ${params.to}: ${params.subject}`);
    return { sent: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!res.ok) {
    console.error(`[email] Failed to send "${params.subject}" to ${params.to}: ${await res.text()}`);
    return { sent: false };
  }

  return { sent: true };
}
