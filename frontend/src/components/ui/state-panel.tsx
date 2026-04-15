import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";

export function StatePanel({
	children,
	tone = "muted",
	onRetry,
}: {
	children: React.ReactNode;
	tone?: "muted" | "destructive";
	onRetry?: () => void;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center gap-4 rounded-2xl border border-dashed p-8 text-sm",
				tone === "destructive" ? "text-destructive" : "text-muted-foreground",
			)}
		>
			<span>{children}</span>
			{onRetry ? (
				<Button variant="outline" size="sm" onClick={onRetry}>
					Try again
				</Button>
			) : null}
		</div>
	);
}
