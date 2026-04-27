import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { infoOptions } from "#/client/@tanstack/react-query.gen";
import { clientEnv } from "#/env/client";

function readBuildId(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const buildId = (data as Record<string, unknown>).buildId;
  return typeof buildId === "string" ? buildId : undefined;
}

function FooterMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span>{label}</span>
      <span className="break-all font-mono text-xs text-foreground">
        {value}
      </span>
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

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-medium text-foreground">Trichter</p>

          <div className="mt-3 w-full max-w-sm space-y-2 p-3 hidden lg:inline">
            <FooterMetaRow
              label="Frontend build"
              value={clientEnv.VITE_BUILD_ID ?? "dev"}
            />
            <BackendBuildInfo />
          </div>
        </div>

        <nav className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between lg:gap-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:justify-end">
            <Link to="/{-$locale}" className="hover:text-foreground">
              Home
            </Link>
            <Link to="/{-$locale}/about" className="hover:text-foreground">
              About
            </Link>
            <Link to="/{-$locale}/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link to="/{-$locale}/app/feed" className="hover:text-foreground">
              Feed
            </Link>
            <Link
              to="/{-$locale}/app/leaderboard"
              className="hover:text-foreground"
            >
              Leaderboard
            </Link>
            <Link
              to="/{-$locale}/policy/privacy"
              className="hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              to="/{-$locale}/policy/impressum"
              className="hover:text-foreground"
            >
              Impressum
            </Link>
          </div>

          <span className="text-xs sm:whitespace-nowrap">© {year}</span>
        </nav>
      </div>
    </footer>
  );
}
