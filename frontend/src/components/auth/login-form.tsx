import { Turnstile } from "@marsidev/react-turnstile";
import { Link } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "#/components/ui/field";
import { clientEnv } from "#/env/client";
import { useAppForm } from "#/hooks/form";
import { useFormError } from "#/hooks/use-form-error";
import { useTurnstile } from "#/hooks/use-turnstile";
import { authClient } from "#/lib/auth-client";
import type { LocaleProps } from "#/lib/utils";
import { isEmail } from "#/lib/validators";
import { AuthCard } from "./auth-card";
import { SocialLoginButton } from "./social-login-button";

type LoginFormValues = {
	login: string;
	password: string;
};

type LoginFormProps = React.ComponentProps<"div"> &
	LocaleProps & {
		redirectTo?: string;
	};

export function LoginForm({
	className,
	locale,
	redirectTo,
	...props
}: LoginFormProps) {
	const {
		error: formError,
		setError: setFormError,
		clearError,
	} = useFormError();
	const { ref: turnstileRef, getFetchOptions } = useTurnstile();

	const form = useAppForm({
		defaultValues: {
			login: "",
			password: "",
		} satisfies LoginFormValues,
		onSubmit: async ({ value }) => {
			clearError();

			const identifier = value.login.trim();
			const password = value.password;
			const fetchOptions = getFetchOptions();
			const callbackURL = redirectTo ?? `/${locale}/app/feed`;

			const result = isEmail(identifier)
				? await authClient.signIn.email({
						email: identifier,
						password,
						callbackURL,
						fetchOptions,
					})
				: await authClient.signIn.username({
						username: identifier,
						password,
						callbackURL,
						fetchOptions,
					});

			if (result.error) {
				setFormError(result.error.message ?? "Login failed");
			}
		},
	});

	return (
		<AuthCard
			className={className}
			title="Welcome back"
			description="Login with your Google account"
			footer={
				<>
					By clicking continue, you agree to our{" "}
					<Link
						to="/{-$locale}/terms"
						params={{ locale }}
						className="underline underline-offset-4"
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						to="/{-$locale}/privacy"
						params={{ locale }}
						className="underline underline-offset-4"
					>
						Privacy Policy
					</Link>
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
					<Field className="flex flex-col gap-2">
						<SocialLoginButton
							label="Login with Google"
							callbackURL={redirectTo ?? `/${locale}/app/feed`}
						/>
						{typeof window !== "undefined" && window.PublicKeyCredential ? (
							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={() => void authClient.signIn.passkey()}
							>
								<KeyRound className="size-4" />
								Login with Passkey
							</Button>
						) : null}
					</Field>

					<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
						Or continue with
					</FieldSeparator>

					<form.AppField
						name="login"
						validators={{
							onChange: ({ value }) => {
								if (!value.trim()) {
									return "Email or username is required";
								}

								return undefined;
							},
						}}
					>
						{(field) => (
							<field.FormTextInput
								label="Email or username"
								type="text"
								placeholder="m@example.com"
								autoComplete="username"
							/>
						)}
					</form.AppField>

					<form.AppField
						name="password"
						validators={{
							onChange: ({ value }) => {
								if (!value) {
									return "Password is required";
								}

								return undefined;
							},
						}}
					>
						{(field) => (
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor={field.name}>Password</FieldLabel>

									<Link
										to="/{-$locale}/forgot-password"
										params={{ locale }}
										className="ml-auto text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</Link>
								</div>

								<field.FormPasswordInput
									hideLabel
									autoComplete="current-password"
								/>
							</Field>
						)}
					</form.AppField>

					<div className="flex w-full justify-center">
						<Turnstile
							ref={turnstileRef}
							siteKey={clientEnv.VITE_TURNSTYLE_SITE_KEY}
						/>
					</div>

					{formError ? (
						<Field>
							<FieldDescription className="text-center text-destructive">
								{formError}
							</FieldDescription>
						</Field>
					) : null}

					<Field>
						<form.AppForm>
							<form.FormSubmitButton label="Login" />
						</form.AppForm>

						<FieldDescription className="text-center">
							Don&apos;t have an account?{" "}
							<Link
								to="/{-$locale}/signup"
								params={{ locale }}
								className="underline underline-offset-4"
							>
								Sign up
							</Link>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</AuthCard>
	);
}
