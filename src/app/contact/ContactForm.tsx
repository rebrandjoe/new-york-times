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

const fieldClass =
  "focus-ring mt-2 w-full border border-white/15 bg-black/50 px-4 py-3 text-sm text-offwhite placeholder:text-gray-muted transition-colors focus:border-accent";

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
        <select id="subject" name="subject" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Select a subject…
          </option>
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FormTextArea id="message" name="message" label="Message" />
      <FormMessage status={state.status} message={state.message} />
      <div className="pt-1">
        <SubmitButton>Send Message</SubmitButton>
      </div>
    </form>
  );
}
