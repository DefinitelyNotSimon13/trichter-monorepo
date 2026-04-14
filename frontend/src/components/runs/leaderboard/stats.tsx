import type { RunView } from "#/client/types.gen";

function formatRate(value?: number) {
  if (typeof value !== "number") {
    return "—";
  }

  return `${value.toFixed(2)}L/min`;
}

export function LeaderboardStats(props: { runs: RunView[] }) {
  const totalRuns = props.runs.length;

  const quickestRun = [...props.runs]
    .filter((run) => typeof run.data?.rate === "number")
    .sort(
      (a, b) => (b.data?.rate ?? -Infinity) - (a.data?.rate ?? -Infinity),
    )[0];

  const quickestUser =
    quickestRun?.user?.name ?? quickestRun?.user?.username ?? "Unknown";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-sm text-muted-foreground">Total Runs</div>
        <div className="mt-3 text-5xl font-semibold tracking-tight">
          {totalRuns}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-sm text-muted-foreground">Best Run</div>
        <div className="mt-3 text-5xl font-semibold tracking-tight">
          {quickestRun ? formatRate(quickestRun.data?.rate) : "—"}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          by {quickestUser}
        </div>
      </div>
    </div>
  );
}
