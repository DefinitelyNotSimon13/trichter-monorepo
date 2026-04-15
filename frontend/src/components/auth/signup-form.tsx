import { useRouter } from "@tanstack/react-router";
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
import { emailValidator, passwordValidator } from "#/lib/validators";
import { AuthCard } from "./auth-card";
import { SocialLoginButton } from "./social-login-button";
import { TurnstileWidget } from "./turnstile-widget";
import { LocalizedLink } from "../localized-link";

type SignupFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupFormProps = React.ComponentProps<"div">;

export function SignupForm({ className, ...props }: SignupFormProps) {
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
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies SignupFormValues,
    onSubmit: async ({ value }) => {
      clearError();

      const fetchOptions = getFetchOptions();

      const result = await authClient.signUp.email({
        name: value.name.trim(),
        email: value.email.trim(),
        username: value.username.trim(),
        displayUsername: value.username.trim(),
        password: value.password,
        callbackURL: `/app/feed`,
        fetchOptions,
      });

      if (result.error) {
        setFormError(result.error.message ?? "Sign up failed");
        return;
      }

      await router.navigate({
        to: "/{-$locale}/app/feed",
        search: { newUser: "1" },
      });
    },
  });

  return (
    <AuthCard
      className={className}
      title="Create your account"
      description="Sign up with Google or create an account with email and username"
      footer={
        <>
          By clicking continue, you agree to our
          <LocalizedLink to="/terms" className="underline underline-offset-4">
            Terms of Service
          </LocalizedLink>
          and
          <LocalizedLink to="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </LocalizedLink>
          .
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
          <Field>
            <SocialLoginButton
              label="Sign up with Google"
              callbackURL={`/app/feed`}
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
                placeholder="simon"
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

            <FieldDescription className="text-center">
              Already have an account?{" "}
              <LocalizedLink
                to="/login"
                className="underline underline-offset-4"
              >
                Sign in
              </LocalizedLink>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
