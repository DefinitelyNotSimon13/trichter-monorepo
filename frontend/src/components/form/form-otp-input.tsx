import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "#/hooks/form-context";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { FormFieldError } from "./form-field-error";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

type FormOTPInputProps = {
  label: string;
  description?: string;
  autoComplete?: string;
};

export function FormOTPInput({
  label,
  description,
  autoComplete,
}: FormOTPInputProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isTouched = useStore(field.store, (state) => state.meta.isTouched);

  return (
    <Field>
      {label.length > 0 && (
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      )}

      <div className="flex justify-center">
        <InputOTP
          id={field.name}
          name={field.name}
          maxLength={6}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e)}
          autoComplete={autoComplete}
          aria-invalid={isTouched && errors.length > 0}
          pattern={REGEXP_ONLY_DIGITS}
        >
          <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isTouched ? <FormFieldError errors={errors} /> : null}
    </Field>
  );
}
