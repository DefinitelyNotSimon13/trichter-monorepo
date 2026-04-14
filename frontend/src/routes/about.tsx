import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <section className="rounded-2xl border p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          About
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          New Frontend for Trichter.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          WIP
        </p>
      </section>
    </main>
  );
}
