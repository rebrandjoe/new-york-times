function wrap(bodyHtml: string): string {
  return `<div style="font-family:Georgia,serif;background:#0b0b0b;color:#f0ede7;padding:32px;">
    <p style="color:#e8a33d;font-weight:bold;letter-spacing:0.1em;font-size:12px;text-transform:uppercase;">JOSEPH MMWA</p>
    ${bodyHtml}
  </div>`;
}

export function subscriptionActivatedEmail(params: { planName: string; renewsOn: string }) {
  const text = `Welcome to JOSEPH MMWA Premium.\n\nYour ${params.planName} membership is active. You now have full access to premium content across JOSEPH MMWA.\n\nRenews: ${params.renewsOn}`;
  const html = wrap(
    `<h1 style="font-size:22px;">Welcome to JOSEPH MMWA Premium</h1>
     <p>Your ${params.planName} membership is active. You now have full access to premium content across JOSEPH MMWA.</p>
     <p style="color:#a39d93;">Renews: ${params.renewsOn}</p>`
  );
  return { subject: "Your JOSEPH MMWA Premium membership is active", html, text };
}

export function paymentFailedEmail(params: { planName: string }) {
  const text = `We couldn't confirm your payment for the ${params.planName} membership. No subscription was activated and nothing further will be charged. You can try again anytime at josephmmwa.com/premium.`;
  const html = wrap(
    `<h1 style="font-size:22px;">Your payment wasn't completed</h1>
     <p>We couldn't confirm your payment for the ${params.planName} membership. No subscription was activated.</p>
     <p><a href="https://josephmmwa.com/premium" style="color:#e8a33d;">Try again</a></p>`
  );
  return { subject: "We couldn't complete your JOSEPH MMWA payment", html, text };
}

export function renewalReminderEmail(params: { planName: string; renewsOn: string }) {
  const text = `Your ${params.planName} JOSEPH MMWA membership renews on ${params.renewsOn}. No action needed if you'd like it to continue.`;
  const html = wrap(
    `<h1 style="font-size:22px;">Your membership renews soon</h1>
     <p>Your ${params.planName} membership renews on ${params.renewsOn}.</p>`
  );
  return { subject: "Your JOSEPH MMWA membership renews soon", html, text };
}

export function subscriptionEndedEmail(params: { planName: string; reason: "cancelled" | "expired" }) {
  const verb = params.reason === "cancelled" ? "has been cancelled" : "has expired";
  const text = `Your ${params.planName} JOSEPH MMWA membership ${verb}. You can rejoin anytime at josephmmwa.com/premium.`;
  const html = wrap(
    `<h1 style="font-size:22px;">Your membership ${verb}</h1>
     <p><a href="https://josephmmwa.com/premium" style="color:#e8a33d;">Rejoin anytime</a></p>`
  );
  return { subject: `Your JOSEPH MMWA membership ${verb}`, html, text };
}
