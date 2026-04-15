import { useTranslation } from "react-i18next";
import { LocalePicker } from "#/components/locale-picker";
import { Button } from "#/components/ui/button";
import { useTheme } from "#/hooks/use-theme";
import { authClient } from "#/lib/auth-client";
import { Spinner } from "./ui/spinner";
import { LocalizedLink } from "./localized-link";

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

export function BrandHeader() {
  const { t } = useTranslation(["common"]);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <LocalizedLink className="text-base font-black tracking-tight text-foreground">
          {t("common:appName")}
        </LocalizedLink>

        <div className="flex items-center gap-3">
          <LocalePicker />
          <IconThemeToggle />
          {isPending ? (
            <Button size="sm" asChild disabled>
              <LocalizedLink disabled>
                <Spinner className="w-12" />
              </LocalizedLink>
            </Button>
          ) : user ? (
            <Button size="sm" asChild>
              <LocalizedLink to="/app/feed">Go to app</LocalizedLink>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <LocalizedLink to="/login">
                {t("common:actions:getStarted")}
              </LocalizedLink>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
