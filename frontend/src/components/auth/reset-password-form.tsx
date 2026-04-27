import { Link, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormMessages } from "#/hooks/use-form-error";
import { authClient } from "#/lib/auth-client";
import { passwordValidator } from "#/lib/validators";
import { AuthCard } from "./auth-card";

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

type ResetPasswordSearch = {
  token?: string;
  error?: string;
};

type ResetPasswordFormProps = React.ComponentProps<"div">;

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const search = useSearch({ strict: false }) as ResetPasswordSearch;
  const { t } = useTranslation("app");

  const token = typeof search.token === "string" ? search.token : undefined;
  const initialError =
    typeof search.error === "string" ? search.error : undefined;

  const initialFormError =
    initialError === "INVALID_TOKEN"
      ? t("auth.resetPassword.invalidToken")
      : null;

  const {
    error: formError,
    setError,
    success: successMessage,
    setSuccess,
    clear,
  } = useFormMessages(initialFormError);

  const canSubmit = Boolean(token);

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    } satisfies ResetPasswordFormValues,
    onSubmit: async ({ value }) => {
      clear();

      if (!token) {
        setError(t("auth.resetPassword.missingToken"));
        return;
      }

      const result = await authClient.resetPassword({
        token,
        newPassword: value.password,
      });

      if (result.error) {
        setError(result.error.message ?? t("auth.resetPassword.failed"));
        return;
      }

      setSuccess(t("auth.resetPassword.success"));
    },
  });

  return (
    <AuthCard
      className={className}
      title={t("auth.resetPassword.title")}
      description={t("auth.resetPassword.description")}
      footer={
        <>
          {t("auth.resetPassword.backTo")}{" "}
          <Link to="/{-$locale}/login" className="underline underline-offset-4">
            {t("auth.resetPassword.login")}
          </Link>
        </>
      }
      {...props}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (canSubmit) void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="password" validators={passwordValidator}>
            {(field) => (
              <field.FormPasswordInput
                label={t("auth.resetPassword.newPassword")}
                autoComplete="new-password"
                description={t("auth.resetPassword.passwordHint")}
              />
            )}
          </form.AppField>

          <form.AppField
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["password"] as const,
              onChange: ({ value, fieldApi }) => {
                if (!value) return t("auth.resetPassword.confirmRequired");
                const password = fieldApi.form.getFieldValue(
                  "password",
                ) as string;
                if (value !== password)
                  return t("auth.resetPassword.passwordsMismatch");
                return undefined;
              },
            }}
          >
            {(field) => (
              <field.FormPasswordInput
                label={t("auth.resetPassword.confirmPassword")}
                autoComplete="new-password"
              />
            )}
          </form.AppField>

          {formError ? (
            <Field>
              <FieldDescription className="text-center text-destructive">
                {formError}
              </FieldDescription>
            </Field>
          ) : null}

          {successMessage ? (
            <Field>
              <FieldDescription className="text-center text-foreground">
                {successMessage}
                <br />
                <Link
                  to="/{-$locale}/login"
                  className="underline underline-offset-4"
                >
                  {t("auth.resetPassword.goToLogin")}
                </Link>
                .
              </FieldDescription>
            </Field>
          ) : null}

          <Field>
            <form.AppForm>
              <form.FormSubmitButton label={t("auth.resetPassword.submit")} />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
