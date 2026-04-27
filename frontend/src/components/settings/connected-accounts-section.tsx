import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/lib/auth-client";

type Account = {
  id: string;
  providerId: string;
  accountId: string;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function formatDate(value?: string | Date | null) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export function ConnectedAccountsSection() {
  const queryClient = useQueryClient();

  const {
    data: accounts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<Account[]> => {
      const result = await authClient.listAccounts();
      return (result?.data ?? []) as Account[];
    },
  });

  const linkGoogleMutation = useMutation({
    mutationFn: async () => {
      return authClient.linkSocial({
        provider: "google",
        callbackURL: "/app/settings",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to connect Google", {
        description: error.message,
      });
    },
  });

  const unlinkGoogleMutation = useMutation({
    mutationFn: async () => {
      const result = await authClient.unlinkAccount({
        providerId: "google",
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }

      return result;
    },
    onSuccess: async () => {
      toast.success("Google account disconnected");
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to disconnect Google", {
        description: error.message,
      });
    },
  });

  const googleAccounts = accounts.filter(
    (account) => account.providerId === "google",
  );
  const isGoogleConnected = googleAccounts.length > 0;
  const canDisconnectGoogle = isGoogleConnected && accounts.length > 1;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">
          Failed to load connected accounts
        </p>
        {"message" in (error ?? {}) ? (
          <p className="text-xs text-muted-foreground">
            {(error as Error).message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border px-4 py-3">
        <div className="flex items-center gap-3">
          <GoogleIcon />
          <div>
            <p className="text-sm font-medium">Google</p>
            <p className="text-xs text-muted-foreground">
              {isGoogleConnected ? "Connected" : "Not connected"}
            </p>

            {isGoogleConnected && googleAccounts[0] ? (
              <p className="pt-0.5 text-xs text-muted-foreground">
                Linked {formatDate(googleAccounts[0].createdAt) ?? "—"}
              </p>
            ) : null}
          </div>
        </div>

        {isGoogleConnected ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canDisconnectGoogle || unlinkGoogleMutation.isPending}
            onClick={() => unlinkGoogleMutation.mutate()}
            title={
              !canDisconnectGoogle
                ? "Cannot disconnect your only sign-in method"
                : undefined
            }
          >
            Disconnect
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={linkGoogleMutation.isPending}
            onClick={() => linkGoogleMutation.mutate()}
          >
            Connect
          </Button>
        )}
      </div>

      {!canDisconnectGoogle && isGoogleConnected ? (
        <p className="text-xs text-muted-foreground">
          This is currently your only linked sign-in method. Add another account
          or set up password-based access before disconnecting Google.
        </p>
      ) : null}
    </div>
  );
}
