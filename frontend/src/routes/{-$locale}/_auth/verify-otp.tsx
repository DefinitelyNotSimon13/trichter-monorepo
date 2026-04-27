import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod/mini";
import { AuthCard } from "#/components/auth/auth-card";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { TurnstileWidget } from "#/components/auth/turnstile-widget";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormError } from "#/hooks/use-form-error";
import { useTurnstile } from "#/hooks/use-turnstile";
import { getSession } from "#/lib/auth.functions";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/{-$locale}/_auth/verify-otp")({
  head: () => ({
    meta: [
      { title: "Verify Code | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: z.object({
    email: z.prefault(z.string(), ""),
    redirectTo: z.prefault(z.string(), "/app/feed"),
  }),
  beforeLoad: async ({ params }) => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({
        to: "/{-$locale}/app/feed",
        params: { locale: params.locale },
      });
    }
  },
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const { email, redirectTo } = Route.useSearch();
  const { ref: turnstileRef, getFetchOptions } = useTurnstile();
  const router = useRouter();
  const { error, setError, clearError } = useFormError();
  const { t } = useTranslation("app");

  const form = useAppForm({
    defaultValues: { otp: "" },
    onSubmit: async ({ value }) => {
      clearError();

      if (!email) {
        setError(t("auth.verifyOtp.missingEmail"));
        return;
      }

      const result = await authClient.signIn.emailOtp({
        email,
        otp: value.otp.trim(),
        fetchOptions: getFetchOptions(),
      });

      if (result.error) {
        setError(result.error.message ?? t("auth.verifyOtp.invalid"));
        return;
      }

      await router.navigate({ to: redirectTo });
    },
  });

  return (
    <AuthCardWrapper>
      <AuthCard title={t("auth.verifyOtp.title")} description="">
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
                  !value.trim() ? t("auth.verifyOtp.codeRequired") : undefined,
              }}
            >
              {(field) => (
                <field.FormOTPInput
                  label=""
                  autoComplete="one-time-code"
                  description={
                    email
                      ? t("auth.verifyOtp.codeDescription_withEmail", { email })
                      : t("auth.verifyOtp.codeDescription_generic")
                  }
                />
              )}
            </form.AppField>

            <TurnstileWidget
              ref={turnstileRef}
              className="flex w-full justify-center"
            />

            {error ? (
              <Field>
                <FieldDescription className="text-destructive">
                  {error}
                </FieldDescription>
              </Field>
            ) : null}

            <form.AppForm>
              <form.FormSubmitButton label={t("auth.verifyOtp.submit")} />
            </form.AppForm>

            <Field>
              <FieldDescription className="text-center">
                {t("auth.verifyOtp.wrongEmail")}{" "}
                <Link
                  to="/{-$locale}/login"
                  search={{ initialLogin: email }}
                  className="underline underline-offset-4"
                >
                  {t("auth.verifyOtp.goBack")}
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthCard>
    </AuthCardWrapper>
  );
}
