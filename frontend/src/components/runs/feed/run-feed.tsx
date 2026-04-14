import type { RunView } from "#/client/types.gen";
import { RunCard } from "#/components/runs/feed/run-card";

export function RunFeed(props: { runs: RunView[]; isFetchingMore?: boolean }) {
  if (props.runs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
        No runs found.
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col w-full items-center lg:items-start">
      {props.runs.map((run) => (
        <RunCard key={run.id} run={run} />
      ))}

      {props.isFetchingMore ? (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Loading more runs…
        </div>
      ) : null}
    </div>
  );
}
