import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
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
import { formatDateTime } from "#/lib/formatters";
import { type AdminUser, UserRowContextMenu } from "./user-row-context-menu";

function roleToLabel(role: AdminUser["role"]) {
  if (Array.isArray(role)) return role.join(", ");
  return role || "user";
}

type Actions = {
  onEdit: (user: AdminUser) => void;
  onSessions: (user: AdminUser) => void;
  onMakeAdmin: (user: AdminUser) => void;
  onMakeUser: (user: AdminUser) => void;
  onBan: (user: AdminUser) => void;
  onUnban: (user: AdminUser) => void;
  onImpersonate: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

type Props = {
  rows: AdminUser[];
  total: number;
  isLoading: boolean;
  sorting: SortingState;
  pagination: PaginationState;
  onSortingChange: (s: SortingState) => void;
  onPaginationChange: (p: PaginationState) => void;
  actions: Actions;
};

export function UsersTable({
  rows,
  total,
  isLoading,
  sorting,
  pagination,
  onSortingChange,
  onPaginationChange,
  actions,
}: Props) {
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

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
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => actions.onEdit(user)}>
                  Edit user
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onSessions(user)}>
                  View sessions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => actions.onMakeAdmin(user)}>
                  Make admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onMakeUser(user)}>
                  Make user
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.banned ? (
                  <DropdownMenuItem onClick={() => actions.onUnban(user)}>
                    Unban user
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => actions.onBan(user)}>
                    Ban user
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => actions.onImpersonate(user)}>
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => actions.onDelete(user)}
                >
                  Delete user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [actions],
  );

  const table = useReactTable({
    data: rows,
    columns,
    pageCount,
    state: { sorting, pagination },
    manualSorting: true,
    manualPagination: true,
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
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
            {isLoading ? (
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
                <UserRowContextMenu
                  key={row.id}
                  user={row.original}
                  actions={actions}
                >
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </UserRowContextMenu>
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
              onPaginationChange({ pageIndex: 0, pageSize: Number(value) })
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
    </div>
  );
}
