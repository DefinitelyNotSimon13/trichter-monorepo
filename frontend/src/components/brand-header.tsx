import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LocalePicker } from "#/components/locale-picker";
import { Button } from "#/components/ui/button";
import { useTheme } from "#/hooks/use-theme";
import { authClient } from "#/lib/auth-client";
import type { LocaleProps } from "#/lib/utils";

function IconThemeToggle() {
  const { toggle, icon: Icon } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full p-2 transition-colors hover:bg-muted"
      aria-label="Toggle theme"
    >
      <Icon className="size-4" />
    </button>
  );
}

type BrandHeaderProps = LocaleProps;

export function BrandHeader({ locale }: BrandHeaderProps) {
  const { t } = useTranslation(["common"]);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/{-$locale}"
          params={{ locale }}
          className="text-base font-black tracking-tight text-foreground"
        >
          {t("common:appName")}
        </Link>

        <div className="flex items-center gap-3">
          <LocalePicker />
          <IconThemeToggle />
          {isPending ? null : user ? (
            <Button size="sm" asChild>
              <Link to="/{-$locale}/app/feed" params={{ locale }}>
                Go to app
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/{-$locale}/login" params={{ locale }}>
                {t("common:auth:signIn")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
