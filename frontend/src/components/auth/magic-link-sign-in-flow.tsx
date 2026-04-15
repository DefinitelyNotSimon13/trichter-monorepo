import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useFormMessages } from "#/hooks/use-form-error";
import { useTurnstile } from "#/hooks/use-turnstile";
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

  const handleSend = async () => {
    clear();

    if (!email) {
      setError("Enter a valid email in the login field above");
      return;
    }

    const result = await authClient.signIn.magicLink({
      email,
      callbackURL: callbackURL ?? "/app/feed",
      fetchOptions: getFetchOptions(),
    });

    if (result.error) {
      setError(result.error.message ?? "Failed to send link");
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
          Magic link sent to{" "}
          <span className="font-medium text-foreground">{sentEmail}</span>.
          Check your inbox and click the link to sign in.
        </p>

        <button
          type="button"
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
    );
  }

  return (
    <FieldGroup>
      <Field>
        <FieldDescription>
          {email ? (
            <>
              Send a magic link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : (
            "Enter a valid email in the login field above to use magic link sign-in."
          )}
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
          Send magic link
        </Button>
      </Field>
    </FieldGroup>
  );
}
