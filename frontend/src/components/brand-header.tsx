import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { useTheme } from "#/hooks/use-theme";
import { LocalePicker } from "#/components/locale-picker";
import { resolveLocale } from "#/lib/i18n/detect-locale";

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
  const matches = useRouterState({ select: (s) => s.matches });
  const localeMatch = matches.find((m) => "locale" in (m.params ?? {}));
  const locale = resolveLocale(localeMatch?.params?.locale);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/{-$locale}"
          params={{ locale }}
          className="text-base font-black tracking-tight text-foreground"
        >
          Trichter
        </Link>

        <div className="flex items-center gap-3">
          <LocalePicker />
          <IconThemeToggle />
          <Button size="sm" disabled>
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
}
