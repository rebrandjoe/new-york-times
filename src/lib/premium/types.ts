export interface SubscriptionPlan {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceUsd: number;
  priceKes: number;
  billingInterval: "monthly" | "annual";
  benefits: string[];
  discountLabel: string | null;
  sortOrder: number;
}

export type SubscriptionStatus =
  | "active"
  | "trial"
  | "pending"
  | "cancelled"
  | "expired"
  | "payment_failed"
  | "suspended";

export type PaymentProvider = "flutterwave" | "paypal";
export type PaymentMethod = "mpesa" | "card" | "paypal";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "successful"
  | "failed"
  | "cancelled"
  | "refunded"
  | "expired";

export interface MySubscription {
  id: string;
  status: SubscriptionStatus;
  provider: PaymentProvider | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan: {
    name: string;
    billingInterval: "monthly" | "annual";
    priceUsd: number;
    priceKes: number;
  };
}

export interface PaymentHistoryItem {
  id: string;
  provider: PaymentProvider;
  method: PaymentMethod | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  providerReference: string;
}
