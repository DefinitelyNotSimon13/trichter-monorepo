import { useSearch } from "@tanstack/react-router";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormMessages } from "#/hooks/use-form-error";
import { authClient } from "#/lib/auth-client";
import { passwordValidator } from "#/lib/validators";
import { AuthCard } from "./auth-card";
import { LocalizedLink } from "../localized-link";

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

  const token = typeof search.token === "string" ? search.token : undefined;
  const initialError =
    typeof search.error === "string" ? search.error : undefined;

  const initialFormError =
    initialError === "INVALID_TOKEN"
      ? "This reset link is invalid or has expired."
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
        setError("Missing reset token.");
        return;
      }

      const result = await authClient.resetPassword({
        token,
        newPassword: value.password,
      });

      if (result.error) {
        setError(result.error.message ?? "Could not reset password");
        return;
      }

      setSuccess("Your password has been reset successfully.");
    },
  });

  return (
    <AuthCard
      className={className}
      title="Set a new password"
      description="Choose a new password for your account."
      footer={
        <>
          Back to{" "}
          <LocalizedLink to="/login" className="underline underline-offset-4">
            login
          </LocalizedLink>
        </>
      }
      {...props}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (canSubmit) {
            void form.handleSubmit();
          }
        }}
      >
        <FieldGroup>
          <form.AppField name="password" validators={passwordValidator}>
            {(field) => (
              <field.FormPasswordInput
                label="New password"
                autoComplete="new-password"
                description="Must be at least 8 characters long."
              />
            )}
          </form.AppField>

          <form.AppField
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["password"] as const,
              onChange: ({ value, fieldApi }) => {
                if (!value) return "Please confirm your password";
                const password = fieldApi.form.getFieldValue(
                  "password",
                ) as string;
                if (value !== password) return "Passwords do not match";
                return undefined;
              },
            }}
          >
            {(field) => (
              <field.FormPasswordInput
                label="Confirm new password"
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
                <LocalizedLink
                  to="/login"
                  className="underline underline-offset-4"
                >
                  Go to login
                </LocalizedLink>
                .
              </FieldDescription>
            </Field>
          ) : null}

          <Field>
            <form.AppForm>
              <form.FormSubmitButton label="Reset password" />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
