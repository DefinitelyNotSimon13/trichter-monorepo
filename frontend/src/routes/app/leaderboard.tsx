import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRunsOptions } from "#/client/@tanstack/react-query.gen";
import type { RunView } from "#/client/types.gen";
import { LeaderboardStats } from "#/components/runs/leaderboard/stats";
import { LeaderboardTable } from "#/components/runs/leaderboard/table";

const PAGE_SIZE = 100;

export const Route = createFileRoute("/app/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const query = useQuery(
    getRunsOptions({
      query: {
        page: 0,
        size: PAGE_SIZE,
        sort: ["createdAt,desc"],
      },
    }),
  );

  if (query.isPending) {
    return (
      <section className="space-y-8">
        <header className="border-b pb-6 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-primary">
            Leaderboard
          </h1>
        </header>

        <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
          Loading leaderboard…
        </div>
      </section>
    );
  }

  if (query.isError) {
    return (
      <section className="space-y-8">
        <header className="border-b pb-6 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-primary">
            Leaderboard
          </h1>
        </header>

        <div className="rounded-2xl border border-dashed p-8 text-sm text-destructive">
          Failed to load leaderboard.
        </div>
      </section>
    );
  }

  const runs: RunView[] = query.data.content ?? [];

  return (
    <section className="space-y-8">
      <header className="border-b pb-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-primary">
          Leaderboard
        </h1>
      </header>

      <LeaderboardStats runs={runs} />

      <div className="border-t" />

      <LeaderboardTable runs={runs} />
    </section>
  );
}
