import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus, Shield, User2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateUserDialog } from "#/components/admin/create-user-dialog";
import { EditUserSheet } from "#/components/admin/edit-user-sheet";
import { UserSessionsSheet } from "#/components/admin/user-sessions-sheet";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Skeleton } from "#/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { useRouteLocale } from "#/hooks/use-route-locale";
import {
  banUser,
  impersonateUser,
  listUsers,
  removeUser,
  setRole,
  unbanUser,
} from "#/lib/admin";
import { formatDateTime } from "#/lib/formatters";

type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: boolean | null;
  image?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  role?: string | string[] | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | Date | null;
  username?: string | null;
  displayUsername?: string | null;
  lastActiveAt?: string | Date | null;
};

function roleToLabel(role: AdminUser["role"]) {
  if (Array.isArray(role)) return role.join(", ");
  return role || "user";
}

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const locale = useRouteLocale();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [sessionsUser, setSessionsUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const sort = sorting[0];
  const sortBy = sort?.id ?? "createdAt";
  const sortDirection = sort?.desc ? "desc" : "asc";

  const usersQuery = useQuery({
    queryKey: [
      "admin-users",
      {
        search,
        roleFilter,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sortBy,
        sortDirection,
      },
    ],
    queryFn: async () => {
      return listUsers({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        sortBy,
        sortDirection,
        ...(search
          ? {
              searchValue: search,
              searchField: "email",
              searchOperator: "contains" as const,
            }
          : {}),
        ...(roleFilter !== "all"
          ? {
              filterField: "role",
              filterValue: roleFilter,
              filterOperator: "eq" as const,
            }
          : {}),
      });
    },
    placeholderData: keepPreviousData,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const banMutation = useMutation({
    mutationFn: async (user: AdminUser) => {
      await banUser({ userId: user.id, banReason: "Banned by admin" });
    },
    onSuccess: async () => {
      toast("User banned");
      await refresh();
    },
    onError: (error: Error) => {
      toast.error("Ban failed", {
        description: error.message,
      });
    },
  });

  const unbanMutation = useMutation({
    mutationFn: async (user: AdminUser) => {
      await unbanUser({ userId: user.id });
    },
    onSuccess: async () => {
      toast("User unbanned");
      await refresh();
    },
    onError: (error: Error) => {
      toast.error("Unban failed", {
        description: error.message,
      });
    },
  });

  const setAdminMutation = useMutation({
    mutationFn: async (user: AdminUser) => {
      await setRole({ userId: user.id, role: "admin" });
    },
    onSuccess: async () => {
      toast("Role updated to admin");
      await refresh();
    },
    onError: (error: Error) => {
      toast.error("Role update failed", {
        description: error.message,
      });
    },
  });

  const setUserMutation = useMutation({
    mutationFn: async (user: AdminUser) => {
      await setRole({ userId: user.id, role: "user" });
    },
    onSuccess: async () => {
      toast("Role updated to user");
      await refresh();
    },
    onError: (error: Error) => {
      toast.error("Role update failed", {
        description: error.message,
      });
    },
  });

  const impersonateMutation = useMutation({
    mutationFn: async (user: AdminUser) => {
      await impersonateUser({ userId: user.id });
    },
    onSuccess: () => {
      toast("Impersonation started");
      window.location.href = `/${locale}/app/feed`;
    },
    onError: (error: Error) => {
      toast.error("Impersonation failed", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (user: AdminUser) => {
      await removeUser({ userId: user.id });
    },
    onSuccess: async () => {
      toast("User deleted");
      await refresh();
    },
    onError: (error: Error) => {
      toast.error("Delete failed", {
        description: error.message,
      });
    },
  });

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="min-w-0">
              <div className="truncate font-medium">
                {user.name ||
                  user.displayUsername ||
                  user.username ||
                  "Unnamed user"}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {user.email}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.username || row.original.displayUsername || "—"}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant="secondary">{roleToLabel(row.original.role)}</Badge>
        ),
      },
      {
        accessorKey: "emailVerified",
        header: "Email",
        cell: ({ row }) =>
          row.original.emailVerified ? (
            <Badge>Verified</Badge>
          ) : (
            <Badge variant="outline">Unverified</Badge>
          ),
      },
      {
        accessorKey: "banned",
        header: "Status",
        cell: ({ row }) =>
          row.original.banned ? (
            <Badge variant="destructive">Banned</Badge>
          ) : (
            <Badge variant="outline">Active</Badge>
          ),
      },
      {
        accessorKey: "lastActiveAt",
        header: "Last active",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.lastActiveAt
              ? formatDateTime(row.original.lastActiveAt)
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.createdAt
              ? formatDateTime(row.original.createdAt)
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open user actions"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setEditingUser(user)}>
                  Edit user
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSessionsUser(user)}>
                  View sessions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setAdminMutation.mutate(user)}>
                  Make admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserMutation.mutate(user)}>
                  Make user
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.banned ? (
                  <DropdownMenuItem onClick={() => unbanMutation.mutate(user)}>
                    Unban user
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => banMutation.mutate(user)}>
                    Ban user
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => impersonateMutation.mutate(user)}
                >
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setUserToDelete(user)}
                >
                  Delete user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [
      banMutation,
      impersonateMutation,
      setAdminMutation,
      setUserMutation,
      unbanMutation,
    ],
  );

  const rows = usersQuery.data?.users ?? [];
  const total = usersQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  const table = useReactTable({
    data: rows,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
    },
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  const stats = {
    total,
    admins: rows.filter((u) => roleToLabel(u.role).includes("admin")).length,
    banned: rows.filter((u) => !!u.banned).length,
  };

  return (
    <section className="space-y-6 p-4 md:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage accounts, roles, bans, sessions, and access from one place.
          </p>
        </div>

        <CreateUserDialog onCreated={refresh}>
          <Button className="w-full lg:w-auto">
            <Plus className="mr-2 size-4" />
            Add user
          </Button>
        </CreateUserDialog>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visible users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Admins on page
            </CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.admins}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Banned on page
            </CardTitle>
            <User2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.banned}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>User directory</CardTitle>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={search}
                onChange={(e) => {
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  setSearch(e.target.value);
                }}
                placeholder="Search by email..."
                className="w-full sm:w-72"
              />

              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  setRoleFilter(value);
                }}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Role filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sortState = header.column.getIsSorted();

                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : canSort ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 font-medium"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              <span className="text-xs text-muted-foreground">
                                {sortState === "asc"
                                  ? "↑"
                                  : sortState === "desc"
                                    ? "↓"
                                    : ""}
                              </span>
                            </button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {usersQuery.isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
                    <TableRow key={i}>
                      {Array.from({ length: columns.length }).map((_, j) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cells
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {rows.length} of {total} users
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(value) =>
                  setPagination({ pageIndex: 0, pageSize: Number(value) })
                }
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditUserSheet
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSaved={refresh}
      />

      <UserSessionsSheet
        user={sessionsUser}
        open={!!sessionsUser}
        onOpenChange={(open) => !open && setSessionsUser(null)}
      />

      <Dialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-foreground">
                {userToDelete?.email}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (userToDelete) {
                  deleteMutation.mutate(userToDelete);
                  setUserToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
