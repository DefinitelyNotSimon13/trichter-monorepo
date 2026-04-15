import { useState } from "react";
import { useStore } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";

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
  disabled?: boolean;
};

export function FormPasswordInput({
  label = "Password",
  placeholder,
  description,
  autoComplete,
  disabled,
  hideLabel = false,
}: FormPasswordInputProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isTouched = useStore(field.store, (state) => state.meta.isTouched);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      {!hideLabel ? (
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      ) : null}

      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          type={showPassword ? "text" : "password"}
          value={field.state.value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isTouched && errors.length > 0}
          className="pr-10" // space for icon
          disabled={disabled}
        />

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1} // optional: avoid tab stop
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isTouched ? <FormFieldError errors={errors} /> : null}
    </Field>
  );
}
