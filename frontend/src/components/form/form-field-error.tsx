type FormFieldErrorValue = string | { message?: string };

export function FormFieldError({
  errors,
}: {
  errors: FormFieldErrorValue[] | undefined;
}) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="space-y-1">
      {errors.map((error) => {
        const message =
          typeof error === "string"
            ? error
            : (error.message ?? "Invalid value");

        return (
          <p key={`${message}`} className="text-sm text-destructive">
            {message}
          </p>
        );
      })}
    </div>
  );
}
