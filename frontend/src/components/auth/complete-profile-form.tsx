import { useRouter } from "@tanstack/react-router";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormError } from "#/hooks/use-form-error";
import { authClient, type ClientUser } from "#/lib/auth-client";
import { AuthCard } from "./auth-card";

type CompleteProfileFormValues = {
  username: string;
  displayUsername: string;
};

export function CompleteProfileForm({
  user,
  callbackUrl,
}: {
  user: ClientUser;
  callbackUrl?: string;
}) {
  const {
    error: formError,
    setError: setFormError,
    clearError,
  } = useFormError();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      username: user.username ?? "",
      displayUsername: user.displayUsername ?? "",
    } satisfies CompleteProfileFormValues,
    onSubmit: async ({ value }) => {
      clearError();

      const username = value.username.trim();
      const displayUsername = value.displayUsername.trim() || username;

      const result = await authClient.updateUser({ username, displayUsername });

      if (result.error) {
        setFormError(result.error.message ?? "Failed to save profile");
        return;
      }

      if (callbackUrl) {
        await router.navigate({ to: callbackUrl, search: {} });
      } else {
        await router.navigate({ to: "/{-$locale}/app/feed", search: {} });
      }
    },
  });

  return (
    <AuthCard
      title="Complete your profile"
      description="Choose a username to finish setting up your account"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
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
                placeholder="yourname"
                autoComplete="username"
              />
            )}
          </form.AppField>

          <form.AppField
            name="displayUsername"
            validators={{
              onChange: () => undefined,
            }}
          >
            {(field) => (
              <field.FormTextInput
                label="Display name"
                type="text"
                placeholder="Your Name"
                autoComplete="nickname"
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

          <Field>
            <form.AppForm>
              <form.FormSubmitButton label="Save and continue" />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
