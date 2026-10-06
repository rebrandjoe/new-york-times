export function LiveTicker({ headline }: { headline: string | null }) {
  if (!headline) return null;

  return (
    <div
      role="status"
      aria-label="Breaking news ticker"
      className="border-b border-red-950 bg-[#c41212]"
    >
      <div className="mx-auto flex max-w-[1440px] items-stretch gap-0 sm:gap-0">
        {/* Breaking label */}
        <div className="flex shrink-0 items-center gap-2 bg-[#8b0000] px-3 py-2 sm:px-4">
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full bg-white motion-safe:animate-pulse"
          />
          <span className="text-[11px] font-black uppercase leading-none tracking-[0.14em] text-white sm:text-xs">
            Breaking
          </span>
        </div>

        {/* Scrolling headline */}
        <div className="relative @container min-w-0 flex-1 overflow-hidden self-center py-2">
          <div className="flex w-max animate-ticker whitespace-nowrap motion-reduce:animate-none">
            <span className="min-w-[100cqw] px-4 text-sm font-extrabold tracking-wide text-white sm:text-[15px]">
              {headline}
            </span>
            <span
              className="min-w-[100cqw] px-4 text-sm font-extrabold tracking-wide text-white sm:text-[15px]"
              aria-hidden="true"
            >
              {headline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
