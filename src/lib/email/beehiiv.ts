/**
 * Beehiiv v2 API — create a publication subscription.
 * Failures are logged and returned; callers should not fail the local signup on Beehiiv errors.
 *
 * Env:
 *   BEEHIIV_API_KEY          — Bearer token from Beehiiv settings
 *   BEEHIIV_PUBLICATION_ID   — e.g. pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */

export type BeehiivSubscribeResult =
  | { ok: true; subscriptionId?: string }
  | { ok: false; reason: string; status?: number };

export async function subscribeEmailToBeehiiv(email: string): Promise<BeehiivSubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY?.trim();
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID?.trim();

  if (!apiKey || !publicationId) {
    console.warn("[beehiiv] BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID is not set — skipping sync");
    return { ok: false, reason: "not_configured" };
  }

  const url = `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        // Local confirm email is sent by us; avoid a second Beehiiv welcome.
        send_welcome_email: false,
        // Allow someone who unsubscribed in Beehiiv to opt in again via the site.
        reactivate_existing: true,
        utm_source: "josephmmwa.com",
        utm_medium: "website",
        utm_campaign: "newsletter_signup",
        referring_site: process.env.NEXT_PUBLIC_SITE_URL || "https://josephmmwa.com",
      }),
    });

    if (response.ok || response.status === 201) {
      let subscriptionId: string | undefined;
      try {
        const json = (await response.json()) as { data?: { id?: string } };
        subscriptionId = json?.data?.id;
      } catch {
        // body optional
      }
      return { ok: true, subscriptionId };
    }

    // 409 / already subscribed is still a successful outcome for our purposes.
    if (response.status === 400 || response.status === 409) {
      const text = await response.text().catch(() => "");
      console.info("[beehiiv] subscription already exists or soft-rejected", response.status, text.slice(0, 200));
      return { ok: true };
    }

    const errText = await response.text().catch(() => "");
    console.error("[beehiiv] subscribe failed", response.status, errText.slice(0, 300));
    return { ok: false, reason: "api_error", status: response.status };
  } catch (err) {
    console.error("[beehiiv] network error", err);
    return { ok: false, reason: "network_error" };
  }
}
