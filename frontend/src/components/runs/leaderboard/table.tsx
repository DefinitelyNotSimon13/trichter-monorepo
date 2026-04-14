import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import type { RunView } from "#/client/types.gen";

function formatDuration(value?: number) {
  if (typeof value !== "number") {
    return "—";
  }

  return `${value.toFixed(3)}s`;
}

function formatVolume(value?: number) {
  if (typeof value !== "number") {
    return "—";
  }

  return `${value.toFixed(2)}L`;
}

function formatRate(value?: number) {
  if (typeof value !== "number") {
    return "—";
  }

  return `${value.toFixed(2)}L/min`;
}

function formatTimestamp(value?: string) {
  if (!value) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

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
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {row.original.rank}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              to="/app/leaderboard"
              search={(prev) => prev}
              className="font-medium text-primary transition hover:text-primary"
              title="Profile view will be added later"
            >
              {row.original.name}
            </Link>
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
    return (
      <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
        No runs found.
      </div>
    );
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
