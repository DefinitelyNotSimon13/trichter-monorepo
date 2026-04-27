import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getRunsOptions } from "#/client/@tanstack/react-query.gen";
import type { RunDto } from "#/client/types.gen";
import { LeaderboardStats } from "#/components/runs/leaderboard/leaderboard-stats";
import { LeaderboardTable } from "#/components/runs/leaderboard/leaderboard-table";
import { Skeleton } from "#/components/ui/skeleton";
import { StatePanel } from "#/components/ui/state-panel";

const PAGE_SIZE = 100;

export const Route = createFileRoute("/{-$locale}/app/leaderboard")({
  staticData: {
    breadcrumb: "Leaderboard",
  },
  // loader: ({ context: { queryClient, session } }) => {
  //   if (!session?.user) return;
  //   return queryClient.ensureQueryData(
  //     getRunsOptions({
  //       query: { page: 0, size: PAGE_SIZE, sort: ["createdAt,desc"] },
  //     }),
  //   );
  // },
  pendingComponent: LeaderboardSkeleton,
  errorComponent: LeaderboardError,
  component: LeaderboardPage,
});

function LeaderboardError({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation("app");
  return (
    <StatePanel tone="destructive" onRetry={reset}>
      {t("leaderboard.loadError")}{" "}
      {error instanceof Error ? error.message : null}
    </StatePanel>
  );
}

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

  const runs: RunDto[] = data.content ?? [];

  return (
    <div className="space-y-8">
      <LeaderboardStats runs={runs} />
      <div className="border-t" />
      <LeaderboardTable runs={runs} />
    </div>
  );
}
