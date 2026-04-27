import { createFileRoute, Link } from "@tanstack/react-router";
import { clientEnv } from "#/env/client";

export const Route = createFileRoute("/{-$locale}/_public/policy/impressum")({
  head: ({ params }) => {
    const locale = params.locale;
    const title = "Impressum | Trichter";
    const siteUrl = clientEnv.VITE_PUBLIC_URL;
    const pageUrl = locale
      ? `${siteUrl}/${locale}/policy/impressum`
      : `${siteUrl}/policy/impressum`;

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
      <article className="rounded-2xl border bg-background p-8 shadow-sm sm:p-10">
        <header className="border-b pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Impressum
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            This Impressum applies to{" "}
            <a
              href="https://next.trichter.hauptspeicher.com"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              https://next.trichter.hauptspeicher.com
            </a>
          </p>
        </header>

        <div className="mt-8 space-y-10">
          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              Operated by
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Trichter
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              Business address
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Werastraße 48
              <br />
              88045, Germany
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              Contact details
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground">
              <li>
                Email:{" "}
                <a
                  href="mailto:simon21.blum@gmail.com"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  simon21.blum@gmail.com
                </a>
              </li>
              <li>
                <Link
                  to="/{-$locale}/contact"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Contact form
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              Authorized representative
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Simon Blum
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
