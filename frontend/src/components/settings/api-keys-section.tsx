import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/lib/auth-client";

type ApiKey = {
  id: string;
  name?: string | null;
  createdAt: string | Date;
  lastRequest?: string | Date | null;
  start?: string | null;
  prefix?: string | null;
  expiresAt?: string | Date | null;
  enabled?: boolean;
  configId?: string;
};

type ListApiKeysResult = {
  apiKeys: ApiKey[];
  total: number;
  limit?: number;
  offset?: number;
};

type CreateApiKeyResult = {
  id?: string;
  name?: string | null;
  key?: string;
  start?: string | null;
  prefix?: string | null;
};

function formatDate(value?: string | Date | null) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export function ApiKeysSection() {
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState("");
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [keyVisible, setKeyVisible] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async (): Promise<ListApiKeysResult> => {
      const result = await authClient.apiKey.list({
        query: {
          sortBy: "createdAt",
          sortDirection: "desc",
          limit: 100,
          offset: 0,
        },
      });

      return {
        apiKeys: result?.data?.apiKeys ?? [],
        total: result?.data?.total ?? 0,
        limit: result?.data?.limit,
        offset: result?.data?.offset,
      };
    },
  });

  const apiKeys = data?.apiKeys ?? [];

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const result = await authClient.apiKey.create({
        name: name.trim() || "My API Key",
      });

      return (result?.data ?? null) as CreateApiKeyResult | null;
    },
    onSuccess: async (data) => {
      if (data?.key) {
        setJustCreated(data.key);
        setKeyVisible(false);
      }

      setNewKeyName("");
      toast.success("API key created");
      await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to create API key", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (keyId: string) => {
      await authClient.apiKey.delete({
        keyId,
      });
    },
    onSuccess: async () => {
      toast.success("API key deleted");
      await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete API key", {
        description: error.message,
      });
    },
  });

  const handleCopy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy API key", {
        description:
          error instanceof Error ? error.message : "Clipboard unavailable",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">Failed to load API keys</p>
        {"message" in (error ?? {}) ? (
          <p className="text-xs text-muted-foreground">
            {(error as Error).message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {justCreated ? (
        <div className="space-y-2 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            API key created. Copy it now, it will not be shown again.
          </p>

          <div className="flex items-center gap-2">
            <code
              className={
                "flex-1 break-all rounded border bg-background px-3 py-2 font-mono text-xs transition-all select-none" +
                (keyVisible ? "" : " blur-sm")
              }
            >
              {justCreated}
            </code>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setKeyVisible((v) => !v)}
              title={keyVisible ? "Hide key" : "Reveal key"}
            >
              {keyVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              <span className="sr-only">{keyVisible ? "Hide" : "Reveal"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => void handleCopy(justCreated)}
            >
              <Copy className="size-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setJustCreated(null)}
            className="text-muted-foreground"
          >
            Dismiss
          </Button>
        </div>
      ) : null}

      {apiKeys.length > 0 ? (
        <div className="space-y-2">
          {apiKeys.map((key) => {
            const createdAt = formatDate(key.createdAt);
            const lastUsed = formatDate(key.lastRequest);
            const expiresAt = formatDate(key.expiresAt);
            const isDeleting =
              deleteMutation.isPending && deleteMutation.variables === key.id;

            return (
              <div
                key={key.id}
                className="flex items-center justify-between rounded-xl border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {key.name ?? "API Key"}

                    {key.start ? (
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {key.start}…
                      </span>
                    ) : null}
                  </p>

                  <p className="pt-0.5 text-xs text-muted-foreground">
                    {createdAt ? `Created ${createdAt}` : "Created —"}
                    {lastUsed ? ` · Last used ${lastUsed}` : ""}
                    {expiresAt ? ` · Expires ${expiresAt}` : ""}
                    {key.enabled === false ? " · Disabled" : ""}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteMutation.mutate(key.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete key</span>
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No API keys yet.</p>
      )}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Key name (optional)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="max-w-64"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !createMutation.isPending) {
              e.preventDefault();
              createMutation.mutate(newKeyName);
            }
          }}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => createMutation.mutate(newKeyName)}
          disabled={createMutation.isPending}
        >
          <Plus className="size-4" />
          Create key
        </Button>
      </div>
    </div>
  );
}
