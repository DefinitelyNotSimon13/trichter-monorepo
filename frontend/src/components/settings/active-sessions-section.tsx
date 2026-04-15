import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Monitor } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/lib/auth-client";

type Session = {
  id: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
};

function parseUserAgent(ua?: string | null): string {
  if (!ua) return "Unknown device";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iPhone / iPad";
  if (ua.includes("Android")) return "Android device";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  return "Browser";
}

export function ActiveSessionsSection() {
  const queryClient = useQueryClient();

  const { data: currentSession } = authClient.useSession();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const result = await authClient.listSessions();
      return (result.data ?? []) as Session[];
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (token: string) => authClient.revokeSession({ token }),
    onSuccess: async () => {
      toast("Session revoked");
      await queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to revoke session", { description: error.message });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    );
  }

  if (!sessions?.length) {
    return (
      <p className="text-sm text-muted-foreground">No active sessions found.</p>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => {
        const isCurrent = session.token === currentSession?.session?.token;
        return (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-xl border px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Monitor className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    {parseUserAgent(session.userAgent)}
                  </p>
                  {isCurrent ? (
                    <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      current
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground pt-0.5">
                  Active{" "}
                  {new Date(session.updatedAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                  {session.ipAddress ? ` · ${session.ipAddress}` : null}
                </p>
              </div>
            </div>
            {!isCurrent ? (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => revokeMutation.mutate(session.token)}
                disabled={revokeMutation.isPending}
              >
                Revoke
              </Button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
