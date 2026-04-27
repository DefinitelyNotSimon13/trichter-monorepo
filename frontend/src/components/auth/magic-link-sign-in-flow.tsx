import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useFormMessages } from "#/hooks/use-form-error";
import type { useTurnstile } from "#/hooks/use-turnstile";
import { authClient } from "#/lib/auth-client";

type GetFetchOptions = ReturnType<typeof useTurnstile>["getFetchOptions"];

type Props = {
  email: string | null;
  callbackURL?: string;
  getFetchOptions: GetFetchOptions;
  onCredentialsLockChange?: (locked: boolean) => void;
};

export function MagicLinkSignInFlow({
  email,
  callbackURL,
  getFetchOptions,
  onCredentialsLockChange,
}: Props) {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const { error, setError, clear } = useFormMessages();
  const { t } = useTranslation("app");

  const handleSend = async () => {
    clear();

    if (!email) {
      setError(t("auth.magicLink.errorEnterEmail"));
      return;
    }

    const result = await authClient.signIn.magicLink({
      email,
      callbackURL: callbackURL ?? "/app/feed",
      fetchOptions: getFetchOptions(),
    });

    if (result.error) {
      setError(result.error.message ?? t("auth.magicLink.errorSend"));
      return;
    }

    setSentEmail(email);
    setSent(true);
    onCredentialsLockChange?.(true);
  };

  const handleClear = () => {
    setSent(false);
    setSentEmail("");
    clear();
    onCredentialsLockChange?.(false);
  };

  if (sent) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {t("auth.magicLink.sent", { email: sentEmail })}
        </p>
        <button
          type="button"
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          onClick={handleClear}
        >
          {t("auth.magicLink.clear")}
        </button>
      </div>
    );
  }

  return (
    <FieldGroup>
      <Field>
        <FieldDescription>
          {email
            ? t("auth.magicLink.sendTo", { email })
            : t("auth.magicLink.enterEmail")}
        </FieldDescription>
      </Field>

      {error ? (
        <Field>
          <FieldDescription className="text-destructive">
            {error}
          </FieldDescription>
        </Field>
      ) : null}

      <Field>
        <Button
          type="button"
          className="w-full"
          disabled={!email}
          onClick={() => void handleSend()}
        >
          {t("auth.magicLink.send")}
        </Button>
      </Field>
    </FieldGroup>
  );
}
