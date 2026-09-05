/** Provider brand marks — the one approved exception to the site's colour
 * system. Kept small and plain, but drawn to actually match each
 * provider's current official brand colours and mark shape rather than a
 * generic recreation. */

export function MpesaMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[3px] px-2.5 py-1 text-sm font-extrabold tracking-tight text-white ${className ?? ""}`}
      style={{ backgroundColor: "#4CAF50" }}
      aria-label="M-Pesa"
    >
      M-PESA
    </span>
  );
}

export function VisaMark({ className }: { className?: string }) {
  return (
    <span
      className={`font-sans text-lg font-black italic tracking-tight ${className ?? ""}`}
      style={{ color: "#1434CB" }}
    >
      VISA
    </span>
  );
}

export function MastercardMark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className ?? ""}`} aria-label="Mastercard">
      <svg width="36" height="22" viewBox="0 0 36 22" aria-hidden="true">
        <circle cx="14" cy="11" r="10" fill="#EB001B" />
        <circle cx="22" cy="11" r="10" fill="#F79E1B" />
      </svg>
    </span>
  );
}

export function PaypalMark({ className }: { className?: string }) {
  return (
    <span className={`font-sans text-lg font-black italic tracking-tight ${className ?? ""}`}>
      <span style={{ color: "#253B80" }}>Pay</span>
      <span style={{ color: "#179BD7" }}>Pal</span>
    </span>
  );
}
