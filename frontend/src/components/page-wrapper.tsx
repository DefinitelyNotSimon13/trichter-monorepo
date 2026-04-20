import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

export function PageWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("animate-[page-enter_300ms_ease-out]", className)}>
      {children}
    </div>
  );
}
