"use client";

import { useMemo, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

/**
 * Drop-in replacement for a plain text <input> for the article editor's
 * Country field. Same value/onChange/className contract as a normal
 * controlled input, so it doesn't change the surrounding label/grid layout
 * — it just adds a live search dropdown of all 195 countries underneath.
 * Still a free-text field underneath (matches the existing articles.country
 * column, which already holds a few non-standard values like "USA"), so an
 * editor can type any value and it's used as-is; the dropdown is purely a
 * fast way to find and pick a name without typing it out.
 */
export function CountryField({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    const list = q ? COUNTRIES.filter((c) => c.toLowerCase().includes(q)) : COUNTRIES;
    return list.slice(0, 8);
  }, [value]);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="Search countries..."
        className={className}
        autoComplete="off"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto border border-white/10 bg-charcoal-deep text-sm shadow-lg">
          {matches.map((c) => (
            <li key={c}>
              <button
                type="button"
                // onMouseDown fires before the input's onBlur, so the click
                // registers before the dropdown closes.
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(c);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-1.5 text-left text-offwhite hover:bg-white/10 ${
                  c === value ? "text-accent" : ""
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
