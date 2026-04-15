import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";

import { setRole, setUserPassword, updateUser } from "#/lib/admin";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Separator } from "#/components/ui/separator";

type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  username?: string | null;
  displayUsername?: string | null;
  role?: string | string[] | null;
};

type Props = {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void | Promise<void>;
};

export function EditUserSheet({ user, open, onOpenChange, onSaved }: Props) {
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      toast("User updated");
      await onSaved?.();
    },
    onError: (error: Error) => {
      toast.error("Update failed", {
        description: error.message,
      });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: setUserPassword,
    onSuccess: () => {
      toast("Password updated");
    },
    onError: (error: Error) => {
      toast.error("Password update failed", {
        description: error.message,
      });
    },
  });

  const roleMutation = useMutation({
    mutationFn: setRole,
    onSuccess: async () => {
      toast("Role updated");
      await onSaved?.();
    },
    onError: (error: Error) => {
      toast.error("Role update failed", {
        description: error.message,
      });
    },
  });

  const profileForm = useForm({
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
    },
    onSubmit: async ({ value }) => {
      if (!user) return;
      await updateMutation.mutateAsync({
        userId: user.id,
        data: {
          name: value.name,
          username: value.username,
        },
      });
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (!user) return;
      await passwordMutation.mutateAsync({
        userId: user.id,
        newPassword: value.password,
      });
    },
  });

  useEffect(() => {
    if (!user) return;
    profileForm.reset({
      name: user.name ?? "",
      username: user.username ?? "",
    });
    passwordForm.reset({
      password: "",
    });
  }, [user]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit user</SheetTitle>
          <SheetDescription>
            {user?.email ?? "No user selected"}
          </SheetDescription>
        </SheetHeader>

        {!user ? null : (
          <div className="mt-6 space-y-8">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void profileForm.handleSubmit();
              }}
            >
              <div>
                <h3 className="font-medium">Profile</h3>
              </div>

              <profileForm.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Name</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </profileForm.Field>

              <profileForm.Field name="username">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Username</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </profileForm.Field>

              <div className="flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  Save profile
                </Button>
              </div>
            </form>

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Role</h3>
              </div>

              <Select
                defaultValue={
                  Array.isArray(user.role)
                    ? user.role[0]
                    : (user.role ?? "user")
                }
                onValueChange={(value) => {
                  void roleMutation.mutateAsync({
                    userId: user.id,
                    role: value,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void passwordForm.handleSubmit();
              }}
            >
              <div>
                <h3 className="font-medium">Set password</h3>
              </div>

              <passwordForm.Field
                name="password"
                validators={{
                  onSubmit: ({ value }) =>
                    value.length < 8
                      ? "Password must be at least 8 characters"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>New password</Label>
                    <Input
                      id={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors[0] ? (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    ) : null}
                  </div>
                )}
              </passwordForm.Field>

              <div className="flex justify-end">
                <Button type="submit" disabled={passwordMutation.isPending}>
                  Set password
                </Button>
              </div>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
