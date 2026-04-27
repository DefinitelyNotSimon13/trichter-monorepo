import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, UserRoundPen } from "lucide-react";
import { useMemo } from "react";
import type { RunDto } from "#/client/types.gen";
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
import { StatePanel } from "#/components/ui/state-panel";
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
import { type RunActions, RunRowContextMenu } from "./run-row-context-menu";

type Props = {
  rows: RunDto[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  sorting: SortingState;
  pagination: PaginationState;
  onSortingChange: (s: SortingState) => void;
  onPaginationChange: (p: PaginationState) => void;
  actions: RunActions;
};

export function RunsTable({
  rows,
  total,
  isLoading,
  isError,
  sorting,
  pagination,
  onSortingChange,
  onPaginationChange,
  actions,
}: Props) {
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  const columns = useMemo<ColumnDef<RunDto>[]>(
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
            {row.original.user?.displayUsername ??
              row.original.user?.username ??
              "—"}
          </span>
        ),
      },
      {
        id: "rate",
        header: "Rate",
        cell: ({ row }) => (
          <Badge variant="secondary">{formatRate(row.original.rate)}</Badge>
        ),
      },
      {
        id: "volume",
        header: "Volume",
        cell: ({ row }) => (
          <span className="text-sm">{formatVolume(row.original.volume)}</span>
        ),
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDuration(row.original.duration)}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open run actions">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => actions.onAssign(row.original)}>
                <UserRoundPen className="mr-2 size-4" />
                Assign user
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => actions.onDelete(row.original)}
              >
                Delete run
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
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
            {isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <StatePanel tone="destructive">
                    Failed to load runs.
                  </StatePanel>
                </TableCell>
              </TableRow>
            ) : isLoading ? (
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
                <RunRowContextMenu
                  key={row.id}
                  run={row.original}
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
                </RunRowContextMenu>
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
