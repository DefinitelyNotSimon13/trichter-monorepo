import { createFileRoute } from "@tanstack/react-router";

import { BrandHeader } from "#/components/brand-header";
import { Footer } from "#/components/footer";
import { clientEnv } from "#/env/client";

export const Route = createFileRoute("/{-$locale}/about")({
  head: ({ params }) => {
    const locale = params.locale;
    const title = "About | Trichter";
    const description =
      "Learn about Trichter, the competitive drinking tracker.";
    const siteUrl = clientEnv.VITE_PUBLIC_URL;
    const pageUrl = locale ? `${siteUrl}/${locale}/about` : `${siteUrl}/about`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: pageUrl },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <BrandHeader />

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
