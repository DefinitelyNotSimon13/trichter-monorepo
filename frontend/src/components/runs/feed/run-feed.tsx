import type { RunView } from "#/client/types.gen";
import { RunCard } from "#/components/runs/feed/run-card";
import { StatePanel } from "#/components/ui/state-panel";

export function RunFeed(props: { runs: RunView[] }) {
  if (props.runs.length === 0) {
    return <StatePanel>No runs found.</StatePanel>;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {props.runs.map((run) => (
        <RunCard key={run.id} run={run} />
      ))}
    </div>
  );
}
