export function CorrectionNotice({ note }: { note: string }) {
  return (
    <div className="border-l-2 border-accent bg-accent/10 px-4 py-3 text-sm text-offwhite">
      <p className="font-bold uppercase tracking-wide text-accent">Correction</p>
      <p className="mt-1">{note}</p>
    </div>
  );
}
