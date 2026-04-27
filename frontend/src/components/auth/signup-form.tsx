import { Link, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormError } from "#/hooks/use-form-error";
import { useTurnstile } from "#/hooks/use-turnstile";
import { authClient } from "#/lib/auth-client";
import { emailValidator, isEmail, passwordValidator } from "#/lib/validators";
import { AuthCard } from "./auth-card";
import { PrivacyNotice } from "./privacy-notice";
import { SocialLoginButton } from "./social-login-button";
import { TurnstileWidget } from "./turnstile-widget";

type SignupFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupFormProps = React.ComponentProps<"div"> & {
  redirectTo?: string;
  initialLogin?: string;
};

export function SignupForm({
  className,
  initialLogin,
  redirectTo,
  ...props
}: SignupFormProps) {
  const {
    error: formError,
    setError: setFormError,
    clearError,
  } = useFormError();
  const { ref: turnstileRef, getFetchOptions } = useTurnstile();
  const router = useRouter();
  const { t } = useTranslation("app");

  const form = useAppForm({
    defaultValues: {
      name: "",
      username: !isEmail(initialLogin ?? "") ? (initialLogin ?? "") : "",
      email: isEmail(initialLogin ?? "") ? (initialLogin ?? "") : "",
      password: "",
      confirmPassword: "",
    } satisfies SignupFormValues,
    onSubmit: async ({ value }) => {
      clearError();

      const fetchOptions = getFetchOptions();

      const { error } = await authClient.signUp.email({
        name: value.name.trim(),
        email: value.email.trim(),
        username: value.username.trim(),
        displayUsername: value.username.trim(),
        password: value.password,
        callbackURL: "/app/feed?newUser=true",
        fetchOptions,
      });

      if (error) {
        setFormError(error.message ?? t("auth.signup.failed"));
        return;
      }

      if (redirectTo) {
        router.navigate({ href: redirectTo });
      } else {
        router.navigate({ to: "/{-$locale}/login", search: { newUser: true } });
      }
    },
  });

  return (
    <AuthCard
      className={className}
      title={t("auth.signup.title")}
      description={t("auth.signup.description")}
      footer={<PrivacyNotice />}
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
          <Field>
            <SocialLoginButton
              label={t("auth.signup.signUpWithGoogle")}
              callbackURL={redirectTo ?? `/app/feed`}
            />
          </Field>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            {t("common:auth.orContinueWith")}
          </FieldSeparator>

          <form.AppField
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? t("auth.signup.nameRequired") : undefined,
            }}
          >
            {(field) => (
              <field.FormTextInput
                label={t("auth.signup.fullName")}
                type="text"
                placeholder="John Doe"
                autoComplete="name"
              />
            )}
          </form.AppField>

          <form.AppField
            name="username"
            validators={{
              onChange: ({ value }) => {
                const trimmed = value.trim();
                if (!trimmed) return t("auth.signup.usernameRequired");
                if (trimmed.length < 3)
                  return t("auth.signup.usernameTooShort");
                if (!/^[a-zA-Z0-9_]+$/.test(trimmed))
                  return t("auth.signup.usernameInvalid");
                return undefined;
              },
            }}
          >
            {(field) => (
              <field.FormTextInput
                label={t("auth.signup.username")}
                type="text"
                placeholder="alcoholicjohn"
                autoComplete="username"
              />
            )}
          </form.AppField>

          <form.AppField name="email" validators={emailValidator}>
            {(field) => (
              <field.FormTextInput
                label={t("auth.signup.email")}
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
              />
            )}
          </form.AppField>

          <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.AppField name="password" validators={passwordValidator}>
              {(field) => (
                <field.FormPasswordInput
                  label={t("auth.signup.password")}
                  autoComplete="new-password"
                  description={t("auth.signup.passwordHint")}
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
                  label={t("auth.signup.confirmPassword")}
                  autoComplete="new-password"
                />
              )}
            </form.AppField>
          </Field>

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

          <Field>
            <form.AppForm>
              <form.FormSubmitButton label={t("auth.signup.submit")} />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>

      <form.Subscribe
        selector={(state) => {
          const trimmedEmail = state.values.email.trim();
          const trimmedUsername = state.values.username.trim();
          return isEmail(trimmedEmail)
            ? trimmedEmail
            : trimmedUsername.length > 0
              ? trimmedUsername
              : undefined;
        }}
        children={(login) => (
          <div className="pt-2">
            <FieldDescription className="text-center">
              {t("auth.signup.alreadyHaveAccount")}{" "}
              <Link
                to="/{-$locale}/login"
                search={{ redirectTo: redirectTo, initialLogin: login }}
                className="underline underline-offset-4"
              >
                {t("auth.signup.signIn")}
              </Link>
            </FieldDescription>
          </div>
        )}
      />
    </AuthCard>
  );
}
