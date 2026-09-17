import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/service";

function isConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY &&
    process.env.NEXT_PUBLIC_SITE_URL
  );
}

/** Pushes a "new article" notification to every stored subscriber. Not a
 * server action (no "use server" here) — only ever called from trusted
 * server code (setArticleStatus / createArticle-and-publish in
 * admin-articles.ts), never directly reachable from a client request.
 * Best-effort: a subscription that's gone stale (410/404 from the push
 * service — the browser unsubscribed, cleared data, etc.) is deleted so
 * the list doesn't grow with dead entries; any other single failure is
 * logged and skipped without blocking the rest of the send or the
 * publish action itself. */
export async function sendNewArticlePush(article: { title: string; slug: string }) {
  if (!isConfigured()) {
    console.warn("[push] VAPID keys not configured — skipping push send.");
    return;
  }

  webpush.setVapidDetails(
    `mailto:${process.env.PUSH_CONTACT_EMAIL || "contact@josephmmwa.com"}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const supabase = createServiceClient();
  const { data: subscriptions, error } = await supabase.from("push_subscriptions").select("*");
  if (error || !subscriptions?.length) return;

  const payload = JSON.stringify({
    title: "JOSEPH MMWA",
    body: article.title,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`,
  });

  const staleEndpoints: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          staleEndpoints.push(sub.endpoint);
        } else {
          console.error("[push] send failed for one subscriber:", err);
        }
      }
    })
  );

  if (staleEndpoints.length > 0) {
    await supabase.from("push_subscriptions").delete().in("endpoint", staleEndpoints);
  }
}
