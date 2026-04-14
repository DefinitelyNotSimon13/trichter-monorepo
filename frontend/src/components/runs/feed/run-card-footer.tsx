import type { RunView } from "#/client/types.gen";

function formatTimestamp(value?: string) {
  if (!value) return "Unknown time";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function RunCardFooter(props: { run: RunView }) {
  const { run } = props;
  const username = run.user?.username ?? "unknown";
  const displayName = run.user?.name ?? "Unknown user";

  return (
    <div className="flex items-center justify-between gap-4 border-t px-5 py-3">
      <a
        href={`/app/users/${run.user?.id ?? ""}`}
        onClick={(event) => event.preventDefault()}
        title="TBD"
        className="truncate text-sm font-semibold text-primary"
      >
        {displayName}
      </a>

      <div className="shrink-0 text-sm text-muted-foreground">
        {formatTimestamp(run.createdAt)}
      </div>
    </div>
  );
}
