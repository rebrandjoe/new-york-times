"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormField, FormTextArea } from "@/components/form/FormField";
import { FormMessage } from "@/components/form/FormMessage";
import { SubmitButton } from "@/components/form/SubmitButton";
import { submitContactMessage } from "@/lib/actions/contact";
import { initialContactState } from "@/lib/actions/form-state";

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
      <FormField id="email" name="email" label="Email" type="email" autoComplete="email" />
      <FormField
        id="organisation"
        name="organisation"
        label="Organisation (optional)"
        required={false}
        autoComplete="organization"
      />
      <FormField id="subject" name="subject" label="Subject" />
      <FormTextArea id="message" name="message" label="Message" />
      <FormMessage status={state.status} message={state.message} />
      <SubmitButton>Send Message</SubmitButton>
    </form>
  );
}
