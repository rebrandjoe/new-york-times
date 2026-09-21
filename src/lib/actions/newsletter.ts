"use server";

import { randomUUID } from "node:crypto";
import { createPublicClient } from "@/lib/supabase/public";
import { sendTransactionalEmail } from "@/lib/email/send";
import { newsletterConfirmEmail } from "@/lib/email/templates";
import { subscribeEmailToBeehiiv } from "@/lib/email/beehiiv";
import type { NewsletterFormState } from "./form-state";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://josephmmwa.com";
}

export async function subscribeToNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  // Generated here rather than read back after insert: the anonymous
  // signup role can insert a row but can't select it back (subscriber
  // lists are admin-only), so we supply the token ourselves.
  const confirmToken = randomUUID();

  const supabase = createPublicClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, confirm_token: confirmToken });

  if (error) {
    if (error.code === "23505") {
      // Already in Supabase — still push to Beehiiv so campaigns stay in sync.
      const beehiiv = await subscribeEmailToBeehiiv(email);
      if (beehiiv.ok) {
        console.info("[newsletter] Beehiiv sync ok (existing subscriber)", email);
      } else {
        console.warn(
          "[newsletter] Beehiiv sync failed (existing subscriber):",
          beehiiv.reason,
          "status" in beehiiv ? beehiiv.status : ""
        );
      }
      return { status: "error", message: "This email is already subscribed." };
    }
    console.error("[newsletter] subscribe failed:", error.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  // Dual-write to Beehiiv for campaign delivery. Do not fail the local signup
  // if Beehiiv is misconfigured or temporarily unavailable.
  const beehiiv = await subscribeEmailToBeehiiv(email);
  if (beehiiv.ok) {
    console.info("[newsletter] Beehiiv sync ok", email, beehiiv.subscriptionId ?? "");
  } else {
    console.warn(
      "[newsletter] Beehiiv sync skipped/failed:",
      beehiiv.reason,
      "status" in beehiiv ? beehiiv.status : ""
    );
  }

  const confirmUrl = `${getSiteUrl()}/newsletter/confirm?token=${confirmToken}`;
  const emailContent = newsletterConfirmEmail({ confirmUrl });
  await sendTransactionalEmail({
    to: email,
    ...emailContent,
  });

  return { status: "success", message: "You're subscribed. Check your email to confirm." };
}
