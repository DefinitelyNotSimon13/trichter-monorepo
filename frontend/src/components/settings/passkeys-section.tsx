import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/lib/auth-client";

type PasskeyEntry = {
  id?: string;
  name?: string;
  credentialID?: string;
  createdAt?: string | Date;
};

export function PasskeysSection() {
  const queryClient = useQueryClient();

  const { data: passkeys, isLoading } = useQuery({
    queryKey: ["passkeys"],
    queryFn: () => authClient.passkey.listUserPasskeys(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authClient.passkey.deletePasskey({ id }),
    onSuccess: async () => {
      toast("Passkey removed");
      await queryClient.invalidateQueries({ queryKey: ["passkeys"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to remove passkey", { description: error.message });
    },
  });

  const addMutation = useMutation({
    mutationFn: () => authClient.passkey.addPasskey(),
    onSuccess: async () => {
      toast("Passkey added successfully");
      await queryClient.invalidateQueries({ queryKey: ["passkeys"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to add passkey", { description: error.message });
    },
  });

  const passkeyList: PasskeyEntry[] = Array.isArray(passkeys?.data)
    ? (passkeys.data as PasskeyEntry[])
    : [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {passkeyList.length === 0 ? (
        <p className="text-sm text-muted-foreground">No passkeys registered.</p>
      ) : (
        <div className="space-y-2">
          {passkeyList.map((pk, i) => (
            <div
              key={pk.id ?? i}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <KeyRound className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {pk.name ?? pk.credentialID ?? "Passkey"}
                  </p>
                  {pk.createdAt ? (
                    <p className="text-xs text-muted-foreground pt-0.5">
                      Added{" "}
                      {new Date(pk.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => pk.id && deleteMutation.mutate(pk.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remove passkey</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addMutation.mutate()}
        disabled={addMutation.isPending}
      >
        <Plus className="size-4" />
        Add a passkey
      </Button>
    </div>
  );
}
