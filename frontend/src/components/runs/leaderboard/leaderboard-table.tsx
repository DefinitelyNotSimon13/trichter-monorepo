import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { RunView } from "#/client/types.gen";
import { Badge } from "#/components/ui/badge";
import {
  formatDuration,
  formatRate,
  formatTimestamp,
  formatVolume,
} from "#/lib/formatters";
import { StatePanel } from "#/components/ui/state-panel";

type LeaderboardRow = {
  rank: number;
  id: string;
  name: string;
  username: string;
  duration?: number;
  volume?: number;
  rate?: number;
  createdAt?: string;
  userId?: string;
};

export function LeaderboardTable(props: { runs: RunView[] }) {
  const data = useMemo<LeaderboardRow[]>(() => {
    return [...props.runs]
      .sort((a, b) => (b.data?.rate ?? -Infinity) - (a.data?.rate ?? -Infinity))
      .map((run, index) => ({
        rank: index + 1,
        id: run.id ?? String(index),
        name: run.user?.name ?? "Unknown",
        username: run.user?.username ?? "unknown",
        duration: run.data?.duration,
        volume: run.data?.volume,
        rate: run.data?.rate,
        createdAt: run.createdAt,
        userId: run.user?.id,
      }));
  }, [props.runs]);

  const columns = useMemo<ColumnDef<LeaderboardRow>[]>(
    () => [
      {
        accessorKey: "rank",
        header: "#",
        cell: ({ row }) => {
          const rank = row.original.rank;
          const badgeClass =
            rank === 1
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              : rank === 2
                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
          return rank <= 3 ? (
            <Badge variant="outline" className={badgeClass}>
              {rank}
            </Badge>
          ) : (
            <Badge variant="ghost">{rank}</Badge>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "duration",
        header: "Time",
        cell: ({ row }) => formatDuration(row.original.duration),
      },
      {
        accessorKey: "volume",
        header: "Amount",
        cell: ({ row }) => formatVolume(row.original.volume),
      },
      {
        accessorKey: "rate",
        header: "Flow Rate",
        cell: ({ row }) => formatRate(row.original.rate),
      },
      {
        accessorKey: "createdAt",
        header: "Timestamp",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatTimestamp(row.original.createdAt)}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return <StatePanel>No runs found.</StatePanel>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-4 text-left font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b last:border-b-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
