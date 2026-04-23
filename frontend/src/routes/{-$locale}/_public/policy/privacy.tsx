import { createFileRoute } from "@tanstack/react-router";
import { clientEnv } from "#/env/client";

export const Route = createFileRoute("/{-$locale}/_public/policy/privacy")({
  head: ({ params }) => {
    const locale = params.locale;
    const title = "Privacy Policy | Trichter";
    const siteUrl = clientEnv.VITE_PUBLIC_URL;
    const pageUrl = locale
      ? `${siteUrl}/${locale}/policy/privacy`
      : `${siteUrl}/policy/privacy`;

    return {
      meta: [
        { title },
        { name: "robots", content: "noindex,follow" },
        { property: "og:title", content: title },
        { property: "og:url", content: pageUrl },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
    };
  },
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
