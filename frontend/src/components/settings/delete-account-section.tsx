import { authClient, type ClientUser } from "#/lib/auth-client";
import { useState } from "react";
import { Field, FieldDescription, FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { useFormMessages } from "#/hooks/use-form-error";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function DeleteAccountSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { error, setError, success, setSuccess, clear } = useFormMessages();

  const form = useAppForm({
    defaultValues: { password: "" },
    onSubmit: async ({ value }) => {
      clear();
      const result = await authClient.deleteUser({
        password: value.password,
        callbackURL: "/goodbye",
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to delete account");
        return;
      }
      setSuccess("Check your email to confirm account deletion.");
      form.reset();
    },
  });

  const handleClose = (open: boolean) => {
    if (!open) {
      form.reset();
      clear();
    }
    setDialogOpen(open);
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <Button variant="destructive" onClick={() => setDialogOpen(true)}>
          Delete Account
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. Enter your password
              to confirm, then check your email to complete deletion.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Password is required" : undefined,
                }}
              >
                {(field) => (
                  <field.FormPasswordInput
                    label="Password"
                    autoComplete="current-password"
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
            </FieldGroup>

            <DialogFooter className="pt-5">
              <form.AppForm>
                <form.FormSubmitButton
                  label="Delete account"
                  variant="destructive"
                />
              </form.AppForm>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
