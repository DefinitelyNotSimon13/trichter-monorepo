import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { FieldDescription } from "#/components/ui/field";
import { cn } from "#/lib/utils";

type AuthCardProps = React.ComponentProps<"div"> & {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({
  className,
  title,
  description,
  children,
  footer,
  ...props
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        className,
      )}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>

      {footer ? (
        <FieldDescription className="px-6 text-center">
          {footer}
        </FieldDescription>
      ) : null}
    </div>
  );
}
