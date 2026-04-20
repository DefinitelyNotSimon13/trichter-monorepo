import { Link, useRouter } from "@tanstack/react-router";
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
import { SocialLoginButton } from "./social-login-button";
import { TurnstileWidget } from "./turnstile-widget";
import { PrivacyNotice } from "./privacy-notice";
import { toast } from "sonner";
import { useState } from "react";

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

      const { data, error } = await authClient.signUp.email({
        name: value.name.trim(),
        email: value.email.trim(),
        username: value.username.trim(),
        displayUsername: value.username.trim(),
        password: value.password,
        callbackURL: "/app/feed?newUser=true",
        fetchOptions,
      });

      if (error) {
        setFormError(error.message ?? "Sign up failed");
        return;
      }

      if (redirectTo) {
        router.navigate({
          href: redirectTo,
        });
      } else {
        router.navigate({
          to: "/{-$locale}/login",
          search: {
            newUser: true,
          },
        });
      }
    },
  });

  return (
    <AuthCard
      className={className}
      title="Create your account"
      description="Sign up with Google or create an account with email and username"
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
              label="Sign up with Google"
              callbackURL={redirectTo ?? `/app/feed`}
            />
          </Field>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            Or continue with
          </FieldSeparator>

          <form.AppField
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) return "Full name is required";
                return undefined;
              },
            }}
          >
            {(field) => (
              <field.FormTextInput
                label="Full name"
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
                if (!trimmed) return "Username is required";
                if (trimmed.length < 3)
                  return "Username must be at least 3 characters";
                if (!/^[a-zA-Z0-9_]+$/.test(trimmed))
                  return "Username may only contain letters, numbers, and underscores";
                return undefined;
              },
            }}
          >
            {(field) => (
              <field.FormTextInput
                label="Username"
                type="text"
                placeholder="alcoholicjohn"
                autoComplete="username"
              />
            )}
          </form.AppField>

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

          <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.AppField name="password" validators={passwordValidator}>
              {(field) => (
                <field.FormPasswordInput
                  label="Password"
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
                  label="Confirm password"
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
              <form.FormSubmitButton label="Create account" />
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
        children={(login) => {
          return (
            <div className="pt-2">
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  to="/{-$locale}/login"
                  search={{
                    redirectTo: redirectTo,
                    initialLogin: login,
                  }}
                  className="underline underline-offset-4"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </div>
          );
        }}
      />
    </AuthCard>
  );
}
