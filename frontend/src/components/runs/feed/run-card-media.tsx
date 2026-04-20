export function RunCardMedia(props: { runId: string; alt: string }) {
  const src = `/api/v2/runs/${props.runId}/image`;

  if (!src) return null;

  return (
    <div className="border-b bg-muted/20">
      <img
        src={src}
        alt={props.alt}
        loading="lazy"
        className="h-72 w-full object-cover"
      />
    </div>
  );
}
