import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "#/hooks/form-context";
import { Input } from "#/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { FormFieldError } from "./form-field-error";

type FormTextInputProps = {
  label: string;
  type?: "text" | "email";
  placeholder?: string;
  description?: string;
  autoComplete?: string;
  disabled?: boolean;
};

export function FormTextInput({
  label,
  type = "text",
  placeholder,
  description,
  autoComplete,
  disabled,
}: FormTextInputProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isTouched = useStore(field.store, (state) => state.meta.isTouched);

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isTouched && errors.length > 0}
        disabled={disabled}
      />

      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isTouched ? <FormFieldError errors={errors} /> : null}
    </Field>
  );
}
