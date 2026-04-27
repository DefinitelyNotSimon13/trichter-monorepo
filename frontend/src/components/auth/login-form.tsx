import { Link, useHydrated, useRouter } from "@tanstack/react-router";
import { ChevronDown, KeyRound, Link2, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormError } from "#/hooks/use-form-error";
import { useTurnstile } from "#/hooks/use-turnstile";
import { authClient } from "#/lib/auth-client";
import { isEmail } from "#/lib/validators";
import { AuthCard } from "./auth-card";
import { PrivacyNotice } from "./privacy-notice";
import { SocialLoginButton } from "./social-login-button";
import { TurnstileWidget } from "./turnstile-widget";

type LoginFormValues = {
  login: string;
  password: string;
};

type LoginFormProps = React.ComponentProps<"div"> & {
  redirectTo?: string;
  initialLogin?: string;
  isOauth?: boolean;
};

type MoreOption = "passkey" | null;
type GetFetchOptions = ReturnType<typeof useTurnstile>["getFetchOptions"];

export function LoginForm({
  className,
  redirectTo,
  initialLogin,
  isOauth,
  ...props
}: LoginFormProps) {
  const {
    error: formError,
    setError: setFormError,
    clearError,
  } = useFormError();
  const { ref: turnstileRef, getFetchOptions } = useTurnstile();
  const hydrated = useHydrated();
  const { t } = useTranslation("app");

  const lastMethod = authClient.getLastUsedLoginMethod();
  const callbackURL = redirectTo ?? "/app/feed";

  var newUserSocialCallbackURL: string;
  if (isOauth) {
    newUserSocialCallbackURL = encodeURI(
      `/complete-profile?callbackUrl=${encodeURI("/new-mobile")}`,
    );
  } else {
    newUserSocialCallbackURL = encodeURI(
      `/complete-profile?callbackUrl=${callbackURL}`,
    );
  }

  const canUsePasskey =
    hydrated && typeof window !== "undefined" && !!window.PublicKeyCredential;

  const moreOptionsDefaultOpen =
    lastMethod === "passkey" ||
    lastMethod === "email-otp" ||
    lastMethod === "magic-link";

  const [activeMoreOption, setActiveMoreOption] = useState<MoreOption>(null);
  const [credentialsLocked, setCredentialsLocked] = useState(false);
  const [magicLinkSentEmail, setMagicLinkSentEmail] = useState<string | null>(
    null,
  );

  const form = useAppForm({
    defaultValues: {
      login: initialLogin ?? "",
      password: "",
    } satisfies LoginFormValues,
    onSubmit: async ({ value }) => {
      clearError();

      const identifier = value.login.trim();
      const password = value.password;
      const fetchOptions = getFetchOptions();

      const { error } = isEmail(identifier)
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

      if (error) {
        setFormError(error.message ?? t("auth.login.failed"));
      }
    },
  });

  return (
    <AuthCard
      className={className}
      title={t("auth.login.title")}
      description={t("auth.login.description")}
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
              label={
                lastMethod === "google"
                  ? t("auth.login.continueWithGoogle")
                  : t("auth.login.loginWithGoogle")
              }
              callbackURL={callbackURL}
              newUserCallbackURL={newUserSocialCallbackURL}
            />
          </Field>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            {t("common:auth.orContinueWith")}
          </FieldSeparator>

          <form.AppField
            name="login"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? t("auth.login.emailRequired") : undefined,
            }}
          >
            {(field) => (
              <field.FormTextInput
                label={t("auth.login.emailOrUsername")}
                type="text"
                placeholder="m@example.com"
                autoComplete="username"
                disabled={credentialsLocked}
              />
            )}
          </form.AppField>

          <form.AppField
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value ? t("auth.login.passwordRequired") : undefined,
            }}
          >
            {(field) => (
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>
                    {t("auth.login.password")}
                  </FieldLabel>
                  <Link
                    to="/{-$locale}/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>
                <field.FormPasswordInput
                  hideLabel
                  autoComplete="current-password"
                  disabled={credentialsLocked}
                />
              </Field>
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

          <Field>
            <form.AppForm>
              <form.FormSubmitButton
                label={t("auth.login.submit")}
                disabled={credentialsLocked}
              />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>

      <form.Subscribe
        selector={(state) => state.values.login}
        children={(login) => {
          const trimmedLogin = login.trim();
          const email = isEmail(trimmedLogin) ? trimmedLogin : null;

          return (
            <div className="pt-5">
              {!isOauth && (
                <FieldDescription className="text-center">
                  {t("auth.login.noAccount")}{" "}
                  <Link
                    to="/{-$locale}/signup"
                    search={{
                      redirectTo: redirectTo,
                      initialLogin:
                        trimmedLogin.length > 0 ? trimmedLogin : undefined,
                    }}
                    className="underline underline-offset-4"
                  >
                    {t("auth.login.signUp")}
                  </Link>
                </FieldDescription>
              )}
              <MoreSignInOptions
                moreOptionsDefaultOpen={moreOptionsDefaultOpen}
                canUsePasskey={canUsePasskey}
                activeMoreOption={activeMoreOption}
                setActiveMoreOption={setActiveMoreOption}
                lastMethod={lastMethod}
                callbackURL={callbackURL}
                email={email}
                getFetchOptions={getFetchOptions}
                credentialsLocked={credentialsLocked}
                onCredentialsLockChange={setCredentialsLocked}
                magicLinkSentEmail={magicLinkSentEmail}
                onMagicLinkSentChange={setMagicLinkSentEmail}
              />
            </div>
          );
        }}
      />
    </AuthCard>
  );
}

function MoreSignInOptions({
  moreOptionsDefaultOpen,
  canUsePasskey,
  activeMoreOption,
  setActiveMoreOption,
  lastMethod,
  callbackURL,
  email,
  getFetchOptions,
  credentialsLocked,
  onCredentialsLockChange,
  magicLinkSentEmail,
  onMagicLinkSentChange,
}: {
  moreOptionsDefaultOpen: boolean;
  canUsePasskey: boolean;
  activeMoreOption: MoreOption;
  setActiveMoreOption: React.Dispatch<React.SetStateAction<MoreOption>>;
  lastMethod: string | null;
  callbackURL: string;
  email: string | null;
  getFetchOptions: GetFetchOptions;
  credentialsLocked: boolean;
  onCredentialsLockChange: (locked: boolean) => void;
  magicLinkSentEmail: string | null;
  onMagicLinkSentChange: (email: string | null) => void;
}) {
  const router = useRouter();
  const { t } = useTranslation("app");

  const sendOtp = async () => {
    if (!email) {
      toast.error(t("auth.login.enterValidEmail"));
      return;
    }

    const result = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
      fetchOptions: getFetchOptions(),
    });

    if (result.error) {
      toast.error(result.error.message ?? t("auth.login.sendOtpFailed"));
      return;
    }

    onCredentialsLockChange(true);

    await router.navigate({
      to: "/{-$locale}/verify-otp",
      search: { email, redirectTo: callbackURL },
    });
  };

  const sendMagicLink = async () => {
    if (!email) {
      toast.error(t("auth.login.enterValidEmail"));
      return;
    }

    const result = await authClient.signIn.magicLink({
      email,
      callbackURL,
      fetchOptions: getFetchOptions(),
    });

    if (result.error) {
      toast.error(result.error.message ?? t("auth.login.sendMagicLinkFailed"));
      return;
    }

    onMagicLinkSentChange(email);
    onCredentialsLockChange(true);
  };

  return (
    <Collapsible defaultOpen={moreOptionsDefaultOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-center py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>{t("auth.login.otherOptions")}</span>
          <ChevronDown className="size-4 transition-transform duration-200 in-data-[state=open]:rotate-180" />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 pt-1">
        {canUsePasskey ? (
          <Button
            type="button"
            variant={activeMoreOption === "passkey" ? "secondary" : "outline"}
            className={
              "w-full justify-start gap-2 " +
              (lastMethod === "passkey" && activeMoreOption === null
                ? "bg-highlight/40 drop-shadow-xs"
                : "")
            }
            disabled={credentialsLocked}
            onClick={() => {
              if (activeMoreOption === "passkey") {
                setActiveMoreOption(null);
                return;
              }

              setActiveMoreOption("passkey");

              void authClient.signIn.passkey({
                fetchOptions: {
                  onSuccess() {
                    void router.navigate({
                      to: "/{-$locale}/app/feed",
                      search: {},
                    });
                  },
                  onError(context) {
                    toast.error(t("auth.login.passkeyFailed"));
                    console.error("Passkey error:", context.error.message);
                    setActiveMoreOption(null);
                  },
                },
              });
            }}
          >
            <KeyRound className="size-4" />
            <span>{t("auth.login.passkey")}</span>
          </Button>
        ) : null}

        <Button
          type="button"
          variant="outline"
          className={
            "w-full justify-start gap-2 " +
            (lastMethod === "email-otp" && activeMoreOption === null
              ? "bg-highlight/40 drop-shadow-xs"
              : "")
          }
          disabled={!email || credentialsLocked}
          onClick={() => void sendOtp()}
        >
          <Mail className="size-4" />
          <span>{t("auth.login.emailOtp")}</span>
        </Button>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className={
              "w-full justify-start gap-2 " +
              (lastMethod === "magic-link" && activeMoreOption === null
                ? "bg-highlight/40 drop-shadow-xs"
                : "")
            }
            disabled={!email || credentialsLocked || !!magicLinkSentEmail}
            onClick={() => void sendMagicLink()}
          >
            <Link2 className="size-4" />
            <span>{t("auth.login.magicLink")}</span>
          </Button>

          {magicLinkSentEmail ? (
            <div className="space-y-2 rounded-xl border bg-muted/40 p-3">
              <p className="text-sm text-muted-foreground">
                {t("auth.login.magicLinkSent", { email: magicLinkSentEmail })}
              </p>
              <button
                type="button"
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                onClick={() => {
                  onMagicLinkSentChange(null);
                  onCredentialsLockChange(false);
                }}
              >
                {t("common:actions.clear")}
              </button>
            </div>
          ) : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
