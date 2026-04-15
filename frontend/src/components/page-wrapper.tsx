import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

/**
 * Wraps page content with a consistent enter animation.
 * Applied at layout level so every route transition gets the same effect.
 */
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
