/** Social platform marks — the approved exception to the site's colour
 * system (same rationale as the payment-provider marks): these need to
 * stay recognisable in each platform's own real brand colour. */

type IconProps = { className?: string };

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#FFFFFF" className={className} aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1.1 2.6c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.5-.3z" />
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5-1.3c1.5.8 3.2 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4 15 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z" />
    </svg>
  );
}

export function FacebookGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#FFFFFF" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.6h2.6l.4-3H13.5V8.3c0-.87.24-1.46 1.5-1.46h1.6V4.14C16.32 4.1 15.36 4 14.24 4c-2.34 0-3.94 1.43-3.94 4.04v2.36H7.7v3h2.6V21h3.2z" />
    </svg>
  );
}

export function XGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#FFFFFF" className={className} aria-hidden="true">
      <path d="M4 4l7.1 9.3L4.4 20h1.9l5.8-6.1L16.9 20H20l-7.5-9.8L19 4h-1.9l-5.4 5.6L8.1 4H4zm2.8 1.5h1.8l8.6 13H15.4l-8.6-13z" />
    </svg>
  );
}

export function LinkedInGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#FFFFFF" className={className} aria-hidden="true">
      <path d="M6.94 8.5H4V20h2.94V8.5zM5.47 4a1.7 1.7 0 100 3.4 1.7 1.7 0 000-3.4zM20 13.3c0-3-1.6-4.4-3.75-4.4-1.73 0-2.5.95-2.93 1.62V8.5H10.4c.04.86 0 11.5 0 11.5h2.92v-6.42c0-.34.02-.69.13-.94.28-.69.9-1.4 1.96-1.4 1.38 0 1.94 1.05 1.94 2.6V20H20v-6.7z" />
    </svg>
  );
}

export function EmailGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LinkGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden="true">
      <path
        d="M9.5 14.5l5-5M8 16l-1.5 1.5a3.5 3.5 0 01-5-5L3 11M16 8l1.5-1.5a3.5 3.5 0 015 5L21 13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.75} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="#FFFFFF" stroke="none" />
    </svg>
  );
}

export const BRAND_COLORS = {
  whatsapp: "#25D366",
  facebook: "#1877F2",
  x: "#000000",
  linkedin: "#0A66C2",
  instagram: "linear-gradient(135deg, #405DE6, #C13584, #FD1D1D, #FCAF45)",
} as const;
