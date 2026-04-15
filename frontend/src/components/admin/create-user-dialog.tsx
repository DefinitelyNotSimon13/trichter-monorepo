import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";

import { createUser } from "#/lib/admin";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import type { ReactNode } from "react";

type Props = {
  onCreated?: () => void | Promise<void>;
  children: ReactNode;
};

export function CreateUserDialog({ children, onCreated }: Props) {
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      toast("User created");
      await onCreated?.();
    },
    onError: (error: Error) => {
      toast.error("Create user failed", {
        description: error.message,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      username: "",
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role,
        ...(value.username
          ? { username: value.username, data: { username: value.username } }
          : {}),
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Add a user manually from the admin dashboard.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onSubmit: ({ value }) =>
                !value?.trim() ? "Name is required" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
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
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onSubmit: ({ value }) =>
                !value?.includes("@") ? "A valid email is required" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  type="email"
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
          </form.Field>

          <form.Field name="username">
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
          </form.Field>

          <form.Field
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
                <Label htmlFor={field.name}>Password</Label>
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
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create user"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
