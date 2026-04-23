import type { RunDto } from "#/client/types.gen";
import { RunCard } from "#/components/runs/feed/run-card";
import { StatePanel } from "#/components/ui/state-panel";

export function ProfileRunsPreview({
  runs,
  count = 5,
}: {
  runs: RunDto[];
  count?: number;
}) {
  const preview = runs.slice(0, count);

  if (preview.length === 0) {
    return <StatePanel>No runs yet.</StatePanel>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {preview.map((run) => (
        <RunCard key={run.id} run={run} />
      ))}
    </div>
  );
}
