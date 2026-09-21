function wrap(bodyHtml: string): string {
  return `<div style="font-family:Georgia,serif;background:#0a0a0a;color:#f0ede7;padding:32px;max-width:560px;margin:0 auto;">
    <p style="color:#f0a83a;font-weight:bold;letter-spacing:0.12em;font-size:11px;text-transform:uppercase;margin:0 0 24px;">JOSEPH MMWA · The MMWA Briefing</p>
    ${bodyHtml}
    <p style="margin-top:32px;font-size:12px;color:#6b6560;line-height:1.5;">If you did not request this, you can ignore this email.</p>
  </div>`;
}

export function newsletterConfirmEmail(params: { confirmUrl: string }) {
  const text = `Confirm your subscription to The MMWA Briefing.\n\nClick the link below to confirm:\n${params.confirmUrl}\n\nIf you did not request this, you can ignore this email.`;
  const html = wrap(
    `<h1 style="font-size:22px;font-weight:normal;margin:0 0 16px;color:#f0ede7;">Confirm your subscription</h1>
     <p style="font-size:16px;line-height:1.6;margin:0 0 12px;color:#f0ede7;">Thank you for joining <strong>The MMWA Briefing</strong> — independent digital health journalism from JOSEPH MMWA.</p>
     <p style="font-size:16px;line-height:1.6;margin:0 0 24px;color:#c4bfb6;">Please confirm your email so we can send you future briefings.</p>
     <p style="margin:0 0 28px;">
       <a href="${params.confirmUrl}" style="display:inline-block;background:#f0a83a;color:#0a0a0a;text-decoration:none;font-family:system-ui,sans-serif;font-weight:700;font-size:14px;padding:12px 22px;border-radius:999px;">Confirm subscription</a>
     </p>
     <p style="font-size:13px;line-height:1.5;color:#6b6560;margin:0;">Or copy this link into your browser:<br/>
       <a href="${params.confirmUrl}" style="color:#f0a83a;word-break:break-all;">${params.confirmUrl}</a>
     </p>`
  );
  return {
    subject: "Confirm your subscription to The MMWA Briefing",
    html,
    text,
  };
}

export function subscriptionActivatedEmail(params: { planName: string; renewsOn: string }) {
  const text = `Welcome to JOSEPH MMWA Premium.\n\nYour ${params.planName} membership is active. You now have full access to premium content across JOSEPH MMWA.\n\nRenews: ${params.renewsOn}`;
  const html = wrap(
    `<h1 style="font-size:22px;font-weight:normal;margin:0 0 16px;color:#f0ede7;">Welcome to JOSEPH MMWA Premium</h1>
     <p style="font-size:16px;line-height:1.6;color:#f0ede7;">Your ${params.planName} membership is active. You now have full access to premium content across JOSEPH MMWA.</p>
     <p style="color:#a39d93;font-size:14px;">Renews: ${params.renewsOn}</p>`
  );
  return { subject: "Your JOSEPH MMWA Premium membership is active", html, text };
}

export function paymentFailedEmail(params: { planName: string }) {
  const text = `We couldn't confirm your payment for the ${params.planName} membership. No subscription was activated and nothing further will be charged. You can try again anytime at josephmmwa.com/premium.`;
  const html = wrap(
    `<h1 style="font-size:22px;font-weight:normal;margin:0 0 16px;color:#f0ede7;">Your payment wasn't completed</h1>
     <p style="font-size:16px;line-height:1.6;color:#f0ede7;">We couldn't confirm your payment for the ${params.planName} membership. No subscription was activated.</p>
     <p style="margin-top:20px;"><a href="https://josephmmwa.com/premium" style="color:#f0a83a;">Try again</a></p>`
  );
  return { subject: "We couldn't complete your JOSEPH MMWA payment", html, text };
}

export function renewalReminderEmail(params: { planName: string; renewsOn: string }) {
  const text = `Your ${params.planName} JOSEPH MMWA membership renews on ${params.renewsOn}. No action needed if you'd like it to continue.`;
  const html = wrap(
    `<h1 style="font-size:22px;font-weight:normal;margin:0 0 16px;color:#f0ede7;">Your membership renews soon</h1>
     <p style="font-size:16px;line-height:1.6;color:#f0ede7;">Your ${params.planName} membership renews on ${params.renewsOn}.</p>`
  );
  return { subject: "Your JOSEPH MMWA membership renews soon", html, text };
}

export function subscriptionEndedEmail(params: { planName: string; reason: "cancelled" | "expired" }) {
  const verb = params.reason === "cancelled" ? "has been cancelled" : "has expired";
  const text = `Your ${params.planName} JOSEPH MMWA membership ${verb}. You can rejoin anytime at josephmmwa.com/premium.`;
  const html = wrap(
    `<h1 style="font-size:22px;font-weight:normal;margin:0 0 16px;color:#f0ede7;">Your membership ${verb}</h1>
     <p style="margin-top:20px;"><a href="https://josephmmwa.com/premium" style="color:#f0a83a;">Rejoin anytime</a></p>`
  );
  return { subject: `Your JOSEPH MMWA membership ${verb}`, html, text };
}
