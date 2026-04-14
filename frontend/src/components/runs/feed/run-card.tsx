import type { RunView } from "#/client/types.gen";
import { RunCardFooter } from "#/components/runs/feed/run-card-footer";
import { RunCardMedia } from "#/components/runs/feed/run-card-media";
import { RunMetric } from "#/components/runs/feed/run-metric";

function formatTimestamp(value?: string) {
  if (!value) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function RunCard(props: { run: RunView }) {
  const { run } = props;
  const username = run.user?.username ?? "unknown";

  return (
    <article className="overflow-hidden rounded-3xl border bg-card shadow-sm max-w-100 w-full">
      {props.run.hasImage && (
        <RunCardMedia
          imageUrl={props.run.imageUrl}
          alt={`Run image by ${username}`}
        />
      )}
      <div className="grid gap-3 grid-cols-3 px-1 pt-1">
        <RunMetric label="Rate" value={run.data?.rate} unit="L/min" />
        <RunMetric label="Volume" value={run.data?.volume} unit="L" />
        <RunMetric label="Duration" value={run.data?.duration} unit="s" />
      </div>
      <RunCardFooter run={props.run} />
    </article>
  );
}
