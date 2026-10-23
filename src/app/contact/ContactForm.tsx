"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormField, FormTextArea } from "@/components/form/FormField";
import { FormMessage } from "@/components/form/FormMessage";
import { SubmitButton } from "@/components/form/SubmitButton";
import { submitContactMessage } from "@/lib/actions/contact";
import { initialContactState } from "@/lib/actions/form-state";

const SUBJECT_OPTIONS = [
  "News tip or story submission",
  "Correction or clarification",
  "Research or media enquiry",
  "Partnerships and collaboration",
  "Advertising and sponsorship",
  "Other professional matter",
] as const;

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialContactState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5" noValidate>
      <FormField id="name" name="name" label="Name" autoComplete="name" />
      <FormField
        id="email"
        name="email"
        label="Email address"
        type="email"
        autoComplete="email"
      />
      <FormField
        id="organisation"
        name="organisation"
        label="Organisation (optional)"
        required={false}
        autoComplete="organization"
      />

      <div>
        <label htmlFor="subject" className="text-sm font-semibold text-offwhite">
          Subject
        </label>
        <div className="relative mt-2">
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className="focus-ring w-full appearance-none border border-white/15 bg-charcoal-deep px-4 py-3 pr-10 text-sm text-offwhite transition-colors hover:border-accent/50 focus:border-accent"
            style={{
              colorScheme: "dark",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f0a83a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.15rem",
            }}
          >
            <option value="" disabled className="bg-charcoal-deep text-gray-muted">
              Select a subject…
            </option>
            {SUBJECT_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
                className="bg-charcoal-deep text-offwhite"
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FormTextArea id="message" name="message" label="Message" />
      <FormMessage status={state.status} message={state.message} />
      <div className="pt-1">
        <SubmitButton>Send Message</SubmitButton>
      </div>
    </form>
  );
}
