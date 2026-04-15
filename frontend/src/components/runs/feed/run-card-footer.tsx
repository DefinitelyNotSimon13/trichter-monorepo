import type { RunView } from "#/client/types.gen";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { CardFooter } from "#/components/ui/card";
import { formatTimestamp } from "#/lib/formatters";

export function RunCardFooter(props: { run: RunView }) {
	const { run } = props;
	const displayName = run.user?.name ?? "Unknown user";

	return (
		<CardFooter className="flex items-center justify-between gap-4 border-t px-5 pb-3">
			<div className="flex items-center gap-2 min-w-0">
				<Avatar className="size-7 shrink-0">
					<AvatarFallback className="text-xs bg-primary/15 text-primary font-bold">
						{displayName[0]?.toUpperCase() ?? "?"}
					</AvatarFallback>
				</Avatar>
				<span className="truncate text-sm font-semibold">{displayName}</span>
			</div>
			<span className="shrink-0 text-sm text-muted-foreground">
				{formatTimestamp(run.createdAt)}
			</span>
		</CardFooter>
	);
}
