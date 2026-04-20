import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getRunsOptions } from "#/client/@tanstack/react-query.gen";
import type { RunView } from "#/client/types.gen";
import { LeaderboardStats } from "#/components/runs/leaderboard/leaderboard-stats";
import { LeaderboardTable } from "#/components/runs/leaderboard/leaderboard-table";
import { Skeleton } from "#/components/ui/skeleton";

const PAGE_SIZE = 100;

export const Route = createFileRoute("/{-$locale}/app/leaderboard")({
  staticData: {
    breadcrumb: "Leaderboard",
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(
      getRunsOptions({
        query: { page: 0, size: PAGE_SIZE, sort: ["createdAt,desc"] },
      }),
    ),
  pendingComponent: LeaderboardSkeleton,
  component: LeaderboardPage,
});

function LeaderboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <div className="border-t" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

function LeaderboardPage() {
  const { data } = useSuspenseQuery(
    getRunsOptions({
      query: {
        page: 0,
        size: PAGE_SIZE,
        sort: ["createdAt,desc"],
      },
    }),
  );

  const runs: RunView[] = data.content ?? [];

  return (
    <div className="space-y-8">
      <LeaderboardStats runs={runs} />
      <div className="border-t" />
      <LeaderboardTable runs={runs} />
    </div>
  );
}
