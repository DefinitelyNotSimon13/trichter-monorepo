import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormMessages } from "#/hooks/use-form-error";
import { authClient, type ClientUser } from "#/lib/auth-client";
import { emailValidator } from "#/lib/validators";

export function ChangeEmailSection({ user }: { user: ClientUser }) {
  const { error, setError, success, setSuccess, clear } = useFormMessages();

  const form = useAppForm({
    defaultValues: { newEmail: "" },
    onSubmit: async ({ value }) => {
      clear();
      const result = await authClient.changeEmail({
        newEmail: value.newEmail.trim(),
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to request email change");
        return;
      }
      setSuccess(
        "Check your inbox — a verification link has been sent to your new email.",
      );
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <p className="text-sm text-muted-foreground">
          Current email:{" "}
          <span className="font-medium text-foreground">{user.email}</span>
        </p>

        <form.AppField name="newEmail" validators={emailValidator}>
          {(field) => (
            <field.FormTextInput
              label="New email address"
              type="email"
              placeholder="new@example.com"
              autoComplete="email"
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
        {success ? (
          <Field>
            <FieldDescription className="text-green-600">
              {success}
            </FieldDescription>
          </Field>
        ) : null}

        <div className="flex justify-start">
          <form.AppForm>
            <form.FormSubmitButton label="Request email change" />
          </form.AppForm>
        </div>
      </FieldGroup>
    </form>
  );
}
