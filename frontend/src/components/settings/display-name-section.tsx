import { useQueryClient } from "@tanstack/react-query";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormMessages } from "#/hooks/use-form-error";
import { authClient, type ClientUser } from "#/lib/auth-client";

export function DisplayNameSection({ user }: { user: ClientUser }) {
  const queryClient = useQueryClient();
  const { error, setError, success, setSuccess, clear } = useFormMessages();

  const form = useAppForm({
    defaultValues: { displayUsername: "" },
    onSubmit: async ({ value }) => {
      clear();
      const result = await authClient.updateUser({
        displayUsername: value.displayUsername.trim(),
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to update display name");
        return;
      }
      setSuccess("Display name updated");
      await queryClient.invalidateQueries({ queryKey: ["session"] });
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
        <form.AppField
          name="displayUsername"
          validators={{
            onChange: ({ value }) =>
              !value.trim() ? "Display name is required" : undefined,
          }}
        >
          {(field) => (
            <field.FormTextInput
              label="Display name"
              type="text"
              placeholder={user.displayUsername ?? user.name ?? ""}
              autoComplete="nickname"
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
            <form.FormSubmitButton label="Update display name" />
          </form.AppForm>
        </div>
      </FieldGroup>
    </form>
  );
}
