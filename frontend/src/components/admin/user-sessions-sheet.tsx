import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listUserSessions,
  revokeUserSession,
  revokeUserSessions,
} from "#/lib/admin";
import { formatDateTime } from "#/lib/formatters";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet";
import { Separator } from "#/components/ui/separator";

type AdminUser = {
  id: string;
  email: string;
};

type Props = {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserSessionsSheet({ user, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-user-sessions", user?.id],
    enabled: !!user?.id && open,
    queryFn: async () => {
      if (!user?.id) throw new Error("Missing user id");
      return listUserSessions({ userId: user.id });
    },
  });

  const revokeOneMutation = useMutation({
    mutationFn: revokeUserSession,
    onSuccess: async () => {
      toast("Session revoked");
      await queryClient.invalidateQueries({
        queryKey: ["admin-user-sessions", user?.id],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to revoke session", {
        description: error.message,
      });
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: revokeUserSessions,
    onSuccess: async () => {
      toast("All sessions revoked");
      await queryClient.invalidateQueries({
        queryKey: ["admin-user-sessions", user?.id],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to revoke sessions", {
        description: error.message,
      });
    },
  });

  const sessions = Array.isArray(query.data) ? query.data : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User sessions</SheetTitle>
          <SheetDescription>
            {user?.email ?? "No user selected"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              disabled={!user || revokeAllMutation.isPending}
              onClick={() =>
                user && revokeAllMutation.mutate({ userId: user.id })
              }
            >
              Revoke all sessions
            </Button>
          </div>

          {query.isLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No active sessions found.
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session: any, index: number) => (
                <div
                  key={session.token ?? index}
                  className="rounded-2xl border p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {session.userAgent || "Unknown device"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        IP: {session.ipAddress || "—"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created:{" "}
                        {session.createdAt
                          ? formatDateTime(session.createdAt)
                          : "—"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires:{" "}
                        {session.expiresAt
                          ? formatDateTime(session.expiresAt)
                          : "—"}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        session.token &&
                        revokeOneMutation.mutate({
                          sessionToken: session.token,
                        })
                      }
                    >
                      Revoke
                    </Button>
                  </div>
                  {index < sessions.length - 1 ? (
                    <Separator className="mt-4" />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
