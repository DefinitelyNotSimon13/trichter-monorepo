type RunMetricProps = {
  label: string;
  value: number | undefined;
  unit: string;
};

export function RunMetric(props: RunMetricProps) {
  return (
    <div className="rounded-xl bg-card/60 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {props.label}
      </div>
      <div className="mt-1">
        <span className="text-base font-semibold text-foreground">
          {props.value?.toFixed(2) ?? "-" + " "}
        </span>
        <span className="text-xs text-muted-foreground">{props.unit}</span>
      </div>
    </div>
  );
}
