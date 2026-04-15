import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { AuthCard } from "#/components/auth/auth-card";
import { useAppForm } from "#/hooks/form";
import { useFormError } from "#/hooks/use-form-error";
import { useTurnstile } from "#/hooks/use-turnstile";
import { authClient } from "#/lib/auth-client";
import { TurnstileWidget } from "#/components/auth/turnstile-widget";
import { Button } from "#/components/ui/button";
import { LocalizedLink } from "#/components/localized-link";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";

export const Route = createFileRoute("/{-$locale}/_auth/verify-otp")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
    redirectTo:
      typeof search.redirectTo === "string" ? search.redirectTo : "/app/feed",
  }),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const { email, redirectTo } = Route.useSearch();
  const router = useRouter();
  const { error, setError, clearError } = useFormError();

  const form = useAppForm({
    defaultValues: {
      otp: "",
    },
    onSubmit: async ({ value }) => {
      clearError();

      if (!email) {
        setError("Missing email address for OTP verification");
        return;
      }

      const result = await authClient.signIn.emailOtp({
        email,
        otp: value.otp.trim(),
      });

      if (result.error) {
        setError(result.error.message ?? "Invalid code");
        return;
      }

      await router.navigate({ to: redirectTo });
    },
  });

  return (
    <AuthCardWrapper>
      <AuthCard title="Verify OTP" description="">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="otp"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? "Code is required" : undefined,
              }}
            >
              {(field) => (
                <field.FormOTPInput
                  label=""
                  autoComplete="one-time-code"
                  description={
                    email
                      ? `Enter the code sent to ${email}`
                      : "Enter the code from your email"
                  }
                />
              )}
            </form.AppField>

            {error ? (
              <Field>
                <FieldDescription className="text-destructive">
                  {error}
                </FieldDescription>
              </Field>
            ) : null}

            <form.AppForm>
              <form.FormSubmitButton label="Verify code" />
            </form.AppForm>

            <Field>
              <FieldDescription className="text-center">
                Wrong email?{" "}
                <LocalizedLink
                  to="/login"
                  className="underline underline-offset-4"
                >
                  Go back
                </LocalizedLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthCard>
    </AuthCardWrapper>
  );
}
