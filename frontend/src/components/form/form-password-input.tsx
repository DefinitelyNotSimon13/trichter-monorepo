import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "#/hooks/form-context";
import { Input } from "#/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { FormFieldError } from "./form-field-error";

type FormPasswordInputProps = {
  label?: string;
  placeholder?: string;
  description?: string;
  autoComplete?: string;
  hideLabel?: boolean;
};

export function FormPasswordInput({
  label = "Password",
  placeholder,
  description,
  autoComplete,
  hideLabel = false,
}: FormPasswordInputProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isTouched = useStore(field.store, (state) => state.meta.isTouched);

  return (
    <Field>
      {!hideLabel ? (
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      ) : null}

      <Input
        id={field.name}
        name={field.name}
        type="password"
        value={field.state.value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isTouched && errors.length > 0}
      />

      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isTouched ? <FormFieldError errors={errors} /> : null}
    </Field>
  );
}
