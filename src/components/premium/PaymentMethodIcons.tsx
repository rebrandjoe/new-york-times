/** Provider brand marks — the one approved exception to the site's colour
 * system. Kept small and plain: a wordmark in the provider's own colour,
 * not a decorative recreation of their logo artwork. */

export function MpesaMark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold ${className ?? ""}`} style={{ color: "#4CAF50" }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <circle cx="8" cy="8" r="8" />
      </svg>
      M-Pesa
    </span>
  );
}

export function VisaMark({ className }: { className?: string }) {
  return (
    <span className={`font-serif text-base font-black italic ${className ?? ""}`} style={{ color: "#1A1F71" }}>
      VISA
    </span>
  );
}

export function MastercardMark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className ?? ""}`} aria-label="Mastercard">
      <svg width="34" height="20" viewBox="0 0 34 20" aria-hidden="true">
        <circle cx="13" cy="10" r="9" fill="#EB001B" />
        <circle cx="21" cy="10" r="9" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </span>
  );
}

export function PaypalMark({ className }: { className?: string }) {
  return (
    <span className={`font-serif text-base font-black italic ${className ?? ""}`} style={{ color: "#003087" }}>
      Pay<span style={{ color: "#009cde" }}>Pal</span>
    </span>
  );
}
