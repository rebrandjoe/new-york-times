"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

export function PasswordField({
  id,
  name,
  label,
  autoComplete,
  required = true,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-offwhite">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          className="focus-ring w-full border border-white/10 bg-charcoal-deep px-4 py-3 pr-11 text-sm text-offwhite placeholder:text-gray-muted transition-colors focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 text-gray-secondary transition-colors hover:text-accent"
        >
          {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
