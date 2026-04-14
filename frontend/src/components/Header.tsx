import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";

function HeaderLink(props: {
  to: "/" | "/app/feed" | "/app/leaderboard";
  children: React.ReactNode;
}) {
  return (
    <Link
      to={props.to}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
      activeProps={{
        className:
          "rounded-md bg-accent px-3 py-2 text-sm font-medium text-foreground",
      }}
    >
      {props.children}
    </Link>
  );
}

function AuthPlaceholder() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled>
        TBD: Auth
      </Button>
    </div>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            Trichter
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <HeaderLink to="/">Home</HeaderLink>
            <HeaderLink to="/app/feed">Feed</HeaderLink>
            <HeaderLink to="/app/leaderboard">Leaderboard</HeaderLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <AuthPlaceholder />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
