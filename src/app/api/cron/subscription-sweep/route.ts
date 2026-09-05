import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendTransactionalEmail } from "@/lib/email/send";
import { renewalReminderEmail, subscriptionEndedEmail } from "@/lib/email/templates";

const REMINDER_WINDOW_DAYS = 3;

/**
 * Daily sweep (see vercel.json): sends a renewal reminder a few days
 * before a fixed-term membership's paid period ends, and marks any
 * subscription past its period end as expired. Guarded by CRON_SECRET so
 * this route can't be triggered by an arbitrary public request.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const reminderCutoff = new Date(now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  let reminded = 0;
  let expired = 0;

  const { data: dueForReminder } = await supabase
    .from("subscriptions")
    .select("id, user_id, current_period_start, current_period_end, cancel_at_period_end, plan:subscription_plans(name)")
    .eq("status", "active")
    .lte("current_period_end", reminderCutoff.toISOString())
    .gt("current_period_end", now.toISOString());

  for (const sub of dueForReminder ?? []) {
    if (sub.cancel_at_period_end) continue;

    const { data: alreadyReminded } = await supabase
      .from("subscription_history")
      .select("id")
      .eq("subscription_id", sub.id)
      .eq("event", "renewal_reminder_sent")
      .gte("created_at", sub.current_period_start ?? sub.current_period_end!)
      .maybeSingle();

    if (alreadyReminded) continue;

    const { data: userLookup } = await supabase.auth.admin.getUserById(sub.user_id);
    if (userLookup.user?.email) {
      const plan = sub.plan as unknown as { name: string } | null;
      const email = renewalReminderEmail({
        planName: plan?.name ?? "JOSEPH MMWA Premium",
        renewsOn: new Date(sub.current_period_end!).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
      await sendTransactionalEmail({ to: userLookup.user.email, ...email });
      reminded += 1;
    }

    await supabase.from("subscription_history").insert({
      subscription_id: sub.id,
      user_id: sub.user_id,
      event: "renewal_reminder_sent",
      actor: "system",
    });
  }

  const { data: dueForExpiry } = await supabase
    .from("subscriptions")
    .select("id, user_id, status, cancel_at_period_end, plan:subscription_plans(name)")
    .in("status", ["active", "trial"])
    .lt("current_period_end", now.toISOString());

  for (const sub of dueForExpiry ?? []) {
    await supabase
      .from("subscriptions")
      .update({ status: "expired", updated_at: now.toISOString() })
      .eq("id", sub.id);

    await supabase.from("subscription_history").insert({
      subscription_id: sub.id,
      user_id: sub.user_id,
      event: "expired",
      previous_status: sub.status,
      new_status: "expired",
      actor: "system",
    });

    const { data: userLookup } = await supabase.auth.admin.getUserById(sub.user_id);
    if (userLookup.user?.email) {
      const plan = sub.plan as unknown as { name: string } | null;
      const email = subscriptionEndedEmail({ planName: plan?.name ?? "JOSEPH MMWA Premium", reason: "expired" });
      await sendTransactionalEmail({ to: userLookup.user.email, ...email });
    }
    expired += 1;
  }

  return NextResponse.json({ ok: true, reminded, expired });
}
