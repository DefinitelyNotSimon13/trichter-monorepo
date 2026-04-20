import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/policy/privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
      <section className="rounded-2xl border p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">WIP</p>
      </section>
    </main>
  );
}
