"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { sendTransactionalEmail } from "@/lib/email/send";
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
  const confirmToken = crypto.randomUUID();

  const supabase = createPublicClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, confirm_token: confirmToken });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "This email is already subscribed." };
    }
    console.error("[newsletter] subscribe failed:", error.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  const confirmUrl = `${getSiteUrl()}/newsletter/confirm?token=${confirmToken}`;
  await sendTransactionalEmail({
    to: email,
    subject: "Confirm your subscription to The MMWA Briefing",
    text: `Confirm your subscription: ${confirmUrl}`,
    html: `<p>Confirm your subscription to The MMWA Briefing:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
  });

  return { status: "success", message: "You're subscribed. Check your email to confirm." };
}
