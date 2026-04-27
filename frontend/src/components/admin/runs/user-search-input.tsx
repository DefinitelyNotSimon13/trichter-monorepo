import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getUsersOptions } from "#/client/@tanstack/react-query.gen";
import type { UserDto } from "#/client/types.gen";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Input } from "#/components/ui/input";
import { Skeleton } from "#/components/ui/skeleton";

type Props = {
  selectedUser: UserDto | null;
  onSelect: (user: UserDto) => void;
  placeholder?: string;
};

export function UserSearchInput({
  selectedUser,
  onSelect,
  placeholder = "Search users…",
}: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(query), 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const searchQuery = useQuery({
    ...getUsersOptions({ query: { q: debouncedQuery, size: 8 } }),
    enabled: debouncedQuery.length >= 2,
  });

  const users = searchQuery.data?.content ?? [];
  const showResults = debouncedQuery.length >= 2;

  return (
    <div className="space-y-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />

      {selectedUser && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <Avatar size="sm">
            <AvatarImage src={selectedUser.image ?? undefined} />
            <AvatarFallback>
              {(selectedUser.displayUsername ?? selectedUser.username ?? "?")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {selectedUser.displayUsername ?? selectedUser.username}
            </p>
            {selectedUser.id && (
              <p className="truncate font-mono text-xs text-muted-foreground">
                {selectedUser.id.slice(0, 8)}…
              </p>
            )}
          </div>
        </div>
      )}

      {showResults && (
        <div className="rounded-lg border bg-popover">
          {searchQuery.isError ? (
            <p className="px-3 py-4 text-center text-sm text-destructive">
              Failed to load users.
            </p>
          ) : searchQuery.isLoading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                <Skeleton key={i} className="h-9 w-full rounded-md" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              No users found.
            </p>
          ) : (
            <ul className="max-h-48 overflow-y-auto p-1">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      onSelect(user);
                      setQuery("");
                      setDebouncedQuery("");
                    }}
                  >
                    <Avatar size="sm">
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback>
                        {(user.displayUsername ?? user.username ?? "?")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium">
                      {user.displayUsername ?? user.username}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
