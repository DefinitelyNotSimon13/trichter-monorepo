import { GalleryVerticalEnd } from "lucide-react";
import type { ReactNode } from "react";
import { LocalizedLink } from "../localized-link";

type AuthCardWrapperProps = React.ComponentProps<"div"> & {
  children: ReactNode;
};

export function AuthCardWrapper({ className, children }: AuthCardWrapperProps) {
  return (
    <div
      className={
        "flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 " +
        className
      }
    >
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LocalizedLink
          to=""
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Trichter
        </LocalizedLink>
        {children}
      </div>
    </div>
  );
}
