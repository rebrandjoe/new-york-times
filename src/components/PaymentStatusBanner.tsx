"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function PaymentStatusBanner() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (paymentStatus === "success") {
      setMessage("Subscription active! Welcome to full member access.");
      setType("success");
    } else if (paymentStatus === "failed") {
      setMessage("Payment failed or was cancelled. Please try again.");
      setType("error");
    } else if (paymentStatus === "error") {
      setMessage("Invalid payment reference. Please contact support.");
      setType("error");
    }
  }, [paymentStatus]);

  if (!message || !type) return null;

  return (
    <div
      className={`mx-auto mb-6 max-w-xl rounded-xl border px-4 py-3 text-sm font-medium ${
        type === "success"
          ? "border-emerald-800/60 bg-emerald-950/60 text-emerald-300"
          : "border-red-800/60 bg-red-950/60 text-red-300"
      }`}
    >
      {message}
    </div>
  );
}
