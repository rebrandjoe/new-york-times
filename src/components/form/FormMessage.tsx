export function FormMessage({
  status,
  message,
}: {
  status: "idle" | "error" | "success";
  message?: string;
}) {
  if (status === "idle" || !message) return null;

  return (
    <p
      role={status === "error" ? "alert" : "status"}
      className={`border px-4 py-3 text-sm ${
        status === "error"
          ? "border-live-red/40 bg-live-red/10 text-live-red"
          : "border-accent/40 bg-accent/10 text-accent"
      }`}
    >
      {message}
    </p>
  );
}
