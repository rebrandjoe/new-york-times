const PAYPAL_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("PayPal credentials are not configured.");

  const basic = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`PayPal auth failed: ${JSON.stringify(json)}`);
  return json.access_token as string;
}

interface PaypalOrder {
  id: string;
  status: string;
  links: { rel: string; href: string; method: string }[];
}

export async function createOrder(params: {
  referenceId: string;
  amountUsd: number;
  returnUrl: string;
  cancelUrl: string;
}): Promise<PaypalOrder> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.referenceId,
          amount: { currency_code: "USD", value: params.amountUsd.toFixed(2) },
        },
      ],
      application_context: {
        brand_name: "JOSEPH MMWA",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        user_action: "PAY_NOW",
      },
    }),
  });
  return res.json();
}

interface PaypalCapture {
  id: string;
  status: string;
  purchase_units?: {
    reference_id: string;
    payments?: {
      captures?: { id: string; status: string; amount: { value: string; currency_code: string } }[];
    };
  }[];
}

/** Authoritative capture — the source of truth for whether money actually moved. */
export async function captureOrder(orderId: string): Promise<PaypalCapture> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.json();
}

export async function getOrder(orderId: string): Promise<PaypalCapture> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

/** Calls PayPal's own signature-verification API rather than validating the
 * certificate locally — simpler and avoids re-implementing crypto PayPal
 * already gets right. */
export async function verifyWebhookSignature(params: {
  transmissionId: string;
  timestamp: string;
  certUrl: string;
  authAlgo: string;
  transmissionSig: string;
  eventBody: unknown;
}): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      transmission_id: params.transmissionId,
      transmission_time: params.timestamp,
      cert_url: params.certUrl,
      auth_algo: params.authAlgo,
      transmission_sig: params.transmissionSig,
      webhook_id: webhookId,
      webhook_event: params.eventBody,
    }),
  });
  const json = await res.json();
  return json.verification_status === "SUCCESS";
}
