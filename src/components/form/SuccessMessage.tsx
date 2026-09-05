import type { ReactNode } from "react";
import { CheckIcon } from "@/components/icons";

/** The one approved use of the success green on the site — reserved
 * strictly for success-state notifications (account creation, password
 * reset, email confirmation), never used decoratively elsewhere. */
export function SuccessMessage({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="flex items-start gap-2 border-l-2 border-success bg-success/10 px-4 py-3 text-sm text-offwhite"
    >
      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      <span>{children}</span>
    </p>
  );
}
