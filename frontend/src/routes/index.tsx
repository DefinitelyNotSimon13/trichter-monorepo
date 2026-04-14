import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <section className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Trichter
        </p>

        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          What's better then regular drinking? <br /> Competetive Drinking!
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          TODO
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="default" asChild>
            <Link to="/app/feed" className="text-background">
              Open feed
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/app/leaderboard">View leaderboard</Link>
          </Button>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border p-6">
          <h2 className="text-base font-semibold">Feed</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There is a feed :O
          </p>
        </article>

        <article className="rounded-2xl border p-6">
          <h2 className="text-base font-semibold">Leaderboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            And a Leaderboard!
          </p>
        </article>

        <article className="rounded-2xl border p-6">
          <h2 className="text-base font-semibold">Coming Soon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Phone App and Images
          </p>
        </article>
      </section>
    </main>
  );
}
