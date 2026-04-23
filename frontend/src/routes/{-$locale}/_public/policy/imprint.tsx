import { createFileRoute } from "@tanstack/react-router";
import { clientEnv } from "#/env/client";

export const Route = createFileRoute("/{-$locale}/_public/policy/imprint")({
  head: ({ params }) => {
    const locale = params.locale;
    const title = "Imprint | Trichter";
    const siteUrl = clientEnv.VITE_PUBLIC_URL;
    const pageUrl = locale
      ? `${siteUrl}/${locale}/policy/imprint`
      : `${siteUrl}/policy/imprint`;

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
    <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
      <h1 className="text-center text-4xl font-black text-highlight">
        Imprint
      </h1>
    </main>
  );
}
