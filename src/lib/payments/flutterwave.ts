const FLW_BASE = "https://api.flutterwave.com/v3";

function requireSecretKey(): string {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) throw new Error("FLUTTERWAVE_SECRET_KEY is not configured.");
  return key;
}

interface FlutterwaveResponse<T> {
  status: string;
  message: string;
  data?: T;
}

/** Initiates an M-Pesa STK push via Flutterwave's mobile-money charge endpoint. */
export async function initiateMpesaCharge(params: {
  txRef: string;
  amountKes: number;
  email: string;
  phoneNumber: string;
  fullName: string;
}): Promise<FlutterwaveResponse<Record<string, unknown>>> {
  const res = await fetch(`${FLW_BASE}/charges?type=mpesa`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amountKes,
      currency: "KES",
      email: params.email,
      phone_number: params.phoneNumber,
      fullname: params.fullName,
    }),
  });
  return res.json();
}

/** Creates a Flutterwave-hosted checkout session (used for card payments) — card
 * details are entered on Flutterwave's own PCI-compliant page, never ours. */
export async function createStandardCheckout(params: {
  txRef: string;
  amountUsd: number;
  email: string;
  fullName: string;
  redirectUrl: string;
}): Promise<FlutterwaveResponse<{ link?: string }>> {
  const res = await fetch(`${FLW_BASE}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amountUsd,
      currency: "USD",
      redirect_url: params.redirectUrl,
      customer: { email: params.email, name: params.fullName },
      customizations: {
        title: "JOSEPH MMWA Premium",
        description: "Membership subscription",
      },
    }),
  });
  return res.json();
}

interface FlutterwaveTransaction {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
  currency: string;
}

/** Authoritative server-to-server check — never trust a webhook payload or a
 * client redirect's query params without this. */
export async function verifyTransactionById(
  transactionId: string | number
): Promise<FlutterwaveResponse<FlutterwaveTransaction>> {
  const res = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${requireSecretKey()}` },
  });
  return res.json();
}

export async function verifyTransactionByReference(
  txRef: string
): Promise<FlutterwaveResponse<FlutterwaveTransaction>> {
  const res = await fetch(
    `${FLW_BASE}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`,
    { headers: { Authorization: `Bearer ${requireSecretKey()}` } }
  );
  return res.json();
}

/** Flutterwave signs webhooks with a shared secret hash configured in the
 * dashboard, sent back verbatim in the `verif-hash` header. */
export function verifyFlutterwaveWebhookSignature(headerHash: string | null): boolean {
  const expected = process.env.FLUTTERWAVE_SECRET_HASH;
  if (!expected || !headerHash) return false;
  return headerHash === expected;
}
