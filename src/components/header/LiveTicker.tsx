const TICKER_TEXT =
  "Live coverage placeholder — this space carries a short line of breaking health-news text when a live story is active.";

export function LiveTicker({ active = true }: { active?: boolean }) {
  if (!active) return null;

  return (
    <div
      role="status"
      aria-label="Live coverage ticker"
      className="border-b border-charcoal bg-black"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
        <span className="flex shrink-0 items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-live-red motion-safe:animate-pulse"
          />
          <span className="text-[11px] font-bold tracking-wider text-live-red">
            LIVE
          </span>
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker whitespace-nowrap motion-reduce:animate-none">
            <span className="px-4 text-[11px] text-gray-muted">{TICKER_TEXT}</span>
            <span className="px-4 text-[11px] text-gray-muted" aria-hidden="true">
              {TICKER_TEXT}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
