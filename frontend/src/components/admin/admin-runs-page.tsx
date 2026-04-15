import {
  keepPreviousData,
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
import { MoreHorizontal, UserRoundPen } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { getRunsOptions } from "#/client/@tanstack/react-query.gen";
import type { RunView } from "#/client/types.gen";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "#/components/ui/context-menu";
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
import { Label } from "#/components/ui/label";
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
import {
  formatDateTime,
  formatDuration,
  formatRate,
  formatVolume,
} from "#/lib/formatters";

type AssignUserDialogProps = {
  run: RunView | null;
  onClose: () => void;
};

function AssignUserDialog({ run, onClose }: AssignUserDialogProps) {
  const [userId, setUserId] = useState("");

  const handleAssign = () => {
    if (!run?.id || !userId.trim()) return;
    console.warn("assign user:", run.id, userId.trim());
    toast("User assigned (mocked)", {
      description: `Run ${run.id.slice(0, 8)}… → user ${userId.trim()}`,
    });
    onClose();
  };

  return (
    <Dialog open={!!run} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Assign user to run</DialogTitle>
          <DialogDescription>
            Enter the user ID to assign to run{" "}
            <span className="font-medium text-foreground">
              {run?.id?.slice(0, 8)}…
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="assign-user-id">User ID</Label>
          <Input
            id="assign-user-id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!userId.trim()}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RunRowActions({
  run,
  onDelete,
  onAssign,
}: {
  run: RunView;
  onDelete: (run: RunView) => void;
  onAssign: (run: RunView) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open run actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onAssign(run)}>
          <UserRoundPen className="mr-2 size-4" />
          Assign user
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(run)}
        >
          Delete run
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminRunsPage() {
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [runToDelete, setRunToDelete] = useState<RunView | null>(null);
  const [runToAssign, setRunToAssign] = useState<RunView | null>(null);

  const sort = sorting[0];
  const sortField = sort?.id ?? "createdAt";
  const sortDir = sort?.desc ? "desc" : "asc";

  const runsQuery = useQuery({
    ...getRunsOptions({
      query: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: [`${sortField},${sortDir}`],
      },
    }),
    placeholderData: keepPreviousData,
  });

  const rows = runsQuery.data?.content ?? [];
  const total = runsQuery.data?.totalElements ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  const handleDelete = (run: RunView) => {
    console.warn("delete run:", run.id);
    toast("Run deleted (mocked)", {
      description: `Run ${run.id?.slice(0, 8)}… removed`,
    });
    setRunToDelete(null);
    void queryClient.invalidateQueries({ queryKey: ["getRunsByUser"] });
  };

  const columns = useMemo<ColumnDef<RunView>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.id?.slice(0, 8)}…
          </span>
        ),
      },
      {
        id: "user",
        header: "User",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            {row.original.user?.name ?? row.original.user?.username ?? "—"}
          </span>
        ),
      },
      {
        id: "rate",
        header: "Rate",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {formatRate(row.original.data?.rate)}
          </Badge>
        ),
      },
      {
        id: "volume",
        header: "Volume",
        cell: ({ row }) => (
          <span className="text-sm">
            {formatVolume(row.original.data?.volume)}
          </span>
        ),
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDuration(row.original.data?.duration)}
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
        cell: ({ row }) => (
          <RunRowActions
            run={row.original}
            onDelete={setRunToDelete}
            onAssign={setRunToAssign}
          />
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    pageCount,
    state: { sorting, pagination },
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="space-y-6 p-4 md:p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Runs</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Browse and manage all runs. Delete and assign operations are currently
          mocked.
        </p>
      </header>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>All runs</CardTitle>
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
                {runsQuery.isLoading ? (
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
                      No runs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <ContextMenu key={row.id}>
                      <ContextMenuTrigger asChild>
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
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-44">
                        <ContextMenuItem
                          onClick={() => setRunToAssign(row.original)}
                        >
                          Assign user
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setRunToDelete(row.original)}
                        >
                          Delete run
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {rows.length} of {total} runs
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

      <Dialog
        open={!!runToDelete}
        onOpenChange={(open) => !open && setRunToDelete(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete run</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete run{" "}
              <span className="font-medium text-foreground">
                {runToDelete?.id?.slice(0, 8)}…
              </span>
              ? This action is currently mocked.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRunToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => runToDelete && handleDelete(runToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AssignUserDialog
        run={runToAssign}
        onClose={() => setRunToAssign(null)}
      />
    </section>
  );
}
