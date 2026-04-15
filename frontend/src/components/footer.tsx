import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { infoOptions } from "#/client/@tanstack/react-query.gen";
import { clientEnv } from "#/env/client";
import { useRouteLocale } from "#/hooks/use-route-locale";

function readBuildId(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const buildId = (data as Record<string, unknown>).buildId;
  return typeof buildId === "string" ? buildId : undefined;
}

function FooterMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span>{label}</span>
      <span className="font-mono text-xs text-foreground">{value}</span>
    </div>
  );
}

function BackendBuildInfo() {
  const query = useQuery(infoOptions());

  let value = "unknown";

  if (query.isPending) {
    value = "loading…";
  } else if (query.isError) {
    value = "unavailable";
  } else {
    value = readBuildId(query.data) ?? "unknown";
  }

  return <FooterMetaRow label="Backend build" value={value} />;
}

export function Footer() {
  const year = new Date().getFullYear();
  const locale = useRouteLocale();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-medium text-foreground">Trichter</p>
          <div className="py-2">
            <FooterMetaRow
              label="Frontend Build"
              value={clientEnv.VITE_BUILD_ID ?? "dev"}
            />
            <BackendBuildInfo />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/{-$locale}"
            params={{ locale }}
            className="hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/{-$locale}/app/feed"
            params={{ locale }}
            className="hover:text-foreground"
          >
            Feed
          </Link>
          <Link
            to="/{-$locale}/app/leaderboard"
            params={{ locale }}
            className="hover:text-foreground"
          >
            Leaderboard
          </Link>
          <span>© {year}</span>
        </div>
      </div>
    </footer>
  );
}
