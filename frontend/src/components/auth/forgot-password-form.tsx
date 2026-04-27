import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormMessages } from "#/hooks/use-form-error";
import { useTurnstile } from "#/hooks/use-turnstile";
import { authClient } from "#/lib/auth-client";
import { emailValidator } from "#/lib/validators";
import { AuthCard } from "./auth-card";
import { TurnstileWidget } from "./turnstile-widget";

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
  const { t } = useTranslation("app");

  const form = useAppForm({
    defaultValues: { email: "" } satisfies ForgotPasswordFormValues,
    onSubmit: async ({ value }) => {
      clear();
      const fetchOptions = getFetchOptions();

      const result = await authClient.requestPasswordReset({
        email: value.email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
        fetchOptions,
      });

      if (result.error) {
        setError(result.error.message ?? t("auth.forgotPassword.failed"));
        return;
      }

      setSuccess(t("auth.forgotPassword.success"));
    },
  });

  return (
    <AuthCard
      className={className}
      title={t("auth.forgotPassword.title")}
      description={t("auth.forgotPassword.description")}
      footer={
        <>
          {t("auth.forgotPassword.rememberedIt")}{" "}
          <Link to="/{-$locale}/login" className="underline underline-offset-4">
            {t("auth.forgotPassword.backToLogin")}
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
                label={t("auth.forgotPassword.email")}
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
              <form.FormSubmitButton label={t("auth.forgotPassword.submit")} />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
