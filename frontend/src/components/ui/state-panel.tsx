import { cn } from "#/lib/utils";

export function StatePanel({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "destructive";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed p-8 text-sm",
        tone === "destructive" ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {children}
    </div>
  );
}
