type RunMetricProps = {
	label: string;
	value: number | undefined;
	unit: string;
};

export function RunMetric(props: RunMetricProps) {
	return (
		<div className="rounded-xl bg-muted/60 px-3 py-3">
			<div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
				{props.label}
			</div>
			<div className="mt-1.5 flex items-baseline gap-1">
				<span className="text-xl font-black text-primary">
					{props.value?.toFixed(2) ?? "—"}
				</span>
				<span className="text-xs text-muted-foreground">{props.unit}</span>
			</div>
		</div>
	);
}
