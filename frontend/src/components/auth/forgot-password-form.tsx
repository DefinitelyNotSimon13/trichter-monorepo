import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormMessages } from "#/hooks/use-form-error";
import { useTurnstile } from "#/hooks/use-turnstile";
import { authClient } from "#/lib/auth-client";
import { emailValidator } from "#/lib/validators";
import { AuthCard } from "./auth-card";
import { TurnstileWidget } from "./turnstile-widget";
import { Link } from "@tanstack/react-router";

type ForgotPasswordFormValues = {
  email: string;
};

type ForgotPasswordFormProps = React.ComponentProps<"div">;

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const {
    error: formError,
    setError,
    success: successMessage,
    setSuccess,
    clear,
  } = useFormMessages();
  const { ref: turnstileRef, getFetchOptions } = useTurnstile();

  const form = useAppForm({
    defaultValues: {
      email: "",
    } satisfies ForgotPasswordFormValues,
    onSubmit: async ({ value }) => {
      clear();

      const fetchOptions = getFetchOptions();

      const result = await authClient.requestPasswordReset({
        email: value.email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
        fetchOptions,
      });

      if (result.error) {
        setError(result.error.message ?? "Could not send reset email");
        return;
      }

      setSuccess(
        "If an account with that email exists, a password reset link has been sent.",
      );
    },
  });

  return (
    <AuthCard
      className={className}
      title="Forgot your password?"
      description="Enter your email address and we will send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/{-$locale}/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </>
      }
      {...props}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="email" validators={emailValidator}>
            {(field) => (
              <field.FormTextInput
                label="Email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
              />
            )}
          </form.AppField>

          <TurnstileWidget
            ref={turnstileRef}
            className="flex w-full justify-center"
          />

          {formError ? (
            <Field>
              <FieldDescription className="text-center text-destructive">
                {formError}
              </FieldDescription>
            </Field>
          ) : null}

          {successMessage ? (
            <Field>
              <FieldDescription className="text-center text-primary">
                {successMessage}
              </FieldDescription>
            </Field>
          ) : null}

          <Field>
            <form.AppForm>
              <form.FormSubmitButton label="Send reset link" />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
