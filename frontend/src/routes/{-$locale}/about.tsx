import { createFileRoute } from "@tanstack/react-router";

import { BrandHeader } from "#/components/brand-header";
import { Footer } from "#/components/footer";

export const Route = createFileRoute("/{-$locale}/about")({
  component: AboutPage,
});

function AboutPage() {
  const { locale } = Route.useParams();

  return (
    <div className="flex min-h-svh flex-col">
      <BrandHeader locale={locale ?? ""} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
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

      <Footer />
    </div>
  );
}
