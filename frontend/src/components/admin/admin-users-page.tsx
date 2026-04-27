import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateUserDialog } from "#/components/admin/create-user-dialog";
import { EditUserSheet } from "#/components/admin/edit-user-sheet";
import { UserSessionsSheet } from "#/components/admin/user-sessions-sheet";
import type { AdminUser } from "#/components/admin/users/user-row-context-menu";
import { UsersStatsCards } from "#/components/admin/users/users-stats-cards";
import { UsersTable } from "#/components/admin/users/users-table";
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
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  banUser,
  impersonateUser,
  listUsers,
  removeUser,
  setRole,
  unbanUser,
} from "#/lib/admin";

export function AdminUsersPage() {
  const queryClient = useQueryClient();

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
    mutationFn: (user: AdminUser) =>
      banUser({ userId: user.id, banReason: "Banned by admin" }),
    onSuccess: async () => {
      toast("User banned");
      await refresh();
    },
    onError: (e: Error) =>
      toast.error("Ban failed", { description: e.message }),
  });

  const unbanMutation = useMutation({
    mutationFn: (user: AdminUser) => unbanUser({ userId: user.id }),
    onSuccess: async () => {
      toast("User unbanned");
      await refresh();
    },
    onError: (e: Error) =>
      toast.error("Unban failed", { description: e.message }),
  });

  const setAdminMutation = useMutation({
    mutationFn: (user: AdminUser) =>
      setRole({ userId: user.id, role: "admin" }),
    onSuccess: async () => {
      toast("Role updated to admin");
      await refresh();
    },
    onError: (e: Error) =>
      toast.error("Role update failed", { description: e.message }),
  });

  const setUserMutation = useMutation({
    mutationFn: (user: AdminUser) => setRole({ userId: user.id, role: "user" }),
    onSuccess: async () => {
      toast("Role updated to user");
      await refresh();
    },
    onError: (e: Error) =>
      toast.error("Role update failed", { description: e.message }),
  });

  const impersonateMutation = useMutation({
    mutationFn: (user: AdminUser) => impersonateUser({ userId: user.id }),
    onSuccess: () => {
      toast("Impersonation started");
      window.location.href = "/app/feed";
    },
    onError: (e: Error) =>
      toast.error("Impersonation failed", { description: e.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (user: AdminUser) => removeUser({ userId: user.id }),
    onSuccess: async () => {
      toast("User deleted");
      await refresh();
    },
    onError: (e: Error) =>
      toast.error("Delete failed", { description: e.message }),
  });

  const anyMutationPending =
    banMutation.isPending ||
    unbanMutation.isPending ||
    setAdminMutation.isPending ||
    setUserMutation.isPending ||
    impersonateMutation.isPending ||
    deleteMutation.isPending;

  const actions = {
    onEdit: setEditingUser,
    onSessions: setSessionsUser,
    onMakeAdmin: (user: AdminUser) => {
      if (anyMutationPending) return;
      setAdminMutation.mutate(user);
    },
    onMakeUser: (user: AdminUser) => {
      if (anyMutationPending) return;
      setUserMutation.mutate(user);
    },
    onBan: (user: AdminUser) => {
      if (anyMutationPending) return;
      banMutation.mutate(user);
    },
    onUnban: (user: AdminUser) => {
      if (anyMutationPending) return;
      unbanMutation.mutate(user);
    },
    onImpersonate: (user: AdminUser) => {
      if (anyMutationPending) return;
      impersonateMutation.mutate(user);
    },
    onDelete: setUserToDelete,
  };

  const rows = usersQuery.data?.users ?? [];
  const total = usersQuery.data?.total ?? 0;

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

      <UsersStatsCards total={total} pageUsers={rows} />

      <Card className="rounded-2xl">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>User directory</CardTitle>
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
        <CardContent>
          <UsersTable
            rows={rows}
            total={total}
            isLoading={usersQuery.isLoading}
            sorting={sorting}
            pagination={pagination}
            onSortingChange={setSorting}
            onPaginationChange={setPagination}
            actions={actions}
          />
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
