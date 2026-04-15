import { Activity, Trophy } from "lucide-react";
import type { RunView } from "#/client/types.gen";
import { Card, CardContent } from "#/components/ui/card";
import { formatRate } from "#/lib/formatters";

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
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Total Runs</p>
							<p className="mt-2 text-5xl font-black tracking-tight">
								{totalRuns}
							</p>
						</div>
						<div className="rounded-xl bg-primary/10 p-2.5">
							<Activity className="size-5 text-primary" />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Best Run</p>
							<p className="mt-2 text-5xl font-black tracking-tight text-primary">
								{quickestRun ? formatRate(quickestRun.data?.rate) : "—"}
							</p>
							<p className="mt-1.5 text-sm text-muted-foreground">
								by {quickestUser}
							</p>
						</div>
						<div
							className="rounded-xl p-2.5"
							style={{
								backgroundColor:
									"color-mix(in oklch, var(--highlight) 15%, transparent)",
							}}
						>
							<Trophy
								className="size-5"
								style={{ color: "var(--highlight)" }}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
