"use client";

export function OfflineRetryButton() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="focus-ring bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
    >
      Try again
    </button>
  );
}
