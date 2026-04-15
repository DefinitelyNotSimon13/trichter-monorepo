import type { RunView } from "#/client/types.gen";
import { Card, CardContent } from "#/components/ui/card";
import { RunCardFooter } from "#/components/runs/feed/run-card-footer";
import { RunCardMedia } from "#/components/runs/feed/run-card-media";
import { RunMetric } from "#/components/runs/feed/run-metric";

export function RunCard(props: { run: RunView }) {
	const { run } = props;
	const username = run.user?.username ?? "unknown";

	return (
		<Card className="overflow-hidden rounded-3xl w-full max-w-100 shadow-sm py-0">
			{run.hasImage && (
				<RunCardMedia
					imageUrl={run.imageUrl}
					alt={`Run image by ${username}`}
				/>
			)}
			<CardContent
				className={
					"grid grid-cols-3 gap-3 pb-0 px-3" + (run.hasImage ? " " : " pt-4")
				}
			>
				<RunMetric label="Rate" value={run.data?.rate} unit="L/min" />
				<RunMetric label="Volume" value={run.data?.volume} unit="L" />
				<RunMetric label="Duration" value={run.data?.duration} unit="s" />
			</CardContent>
			<RunCardFooter run={run} />
		</Card>
	);
}
