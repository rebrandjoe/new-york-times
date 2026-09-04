export function FormField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required = true,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-offwhite">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="focus-ring mt-2 w-full border border-white/10 bg-charcoal-deep px-4 py-3 text-sm text-offwhite placeholder:text-gray-muted transition-colors focus:border-accent"
      />
    </div>
  );
}

export function FormTextArea({
  id,
  name,
  label,
  required = true,
  rows = 6,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-offwhite">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        className="focus-ring mt-2 w-full resize-y border border-white/10 bg-charcoal-deep px-4 py-3 text-sm text-offwhite placeholder:text-gray-muted transition-colors focus:border-accent"
      />
    </div>
  );
}
