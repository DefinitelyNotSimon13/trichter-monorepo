import { useRouter } from "@tanstack/react-router";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormMessages } from "#/hooks/use-form-error";
import { authClient } from "#/lib/auth-client";

export function ChangePasswordSection() {
  const { error, setError, success, setSuccess, clear } = useFormMessages();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      clear();
      const result = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: false,
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to change password");
        return;
      }
      setSuccess("Password changed successfully");
      form.reset();
      router.invalidate();
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
        <form.AppField
          name="currentPassword"
          validators={{
            onChange: ({ value }) =>
              !value ? "Current password is required" : undefined,
          }}
        >
          {(field) => (
            <field.FormPasswordInput
              label="Current password"
              autoComplete="current-password"
            />
          )}
        </form.AppField>

        <form.AppField
          name="newPassword"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "New password is required";
              if (value.length < 8) return "Must be at least 8 characters";
              return undefined;
            },
          }}
        >
          {(field) => (
            <field.FormPasswordInput
              label="New password"
              autoComplete="new-password"
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
            <form.FormSubmitButton label="Change password" />
          </form.AppForm>
        </div>
      </FieldGroup>
    </form>
  );
}
