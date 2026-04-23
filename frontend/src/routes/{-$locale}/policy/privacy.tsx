import { BrandHeader } from "#/components/brand-header";
import { Footer } from "#/components/footer";
import { createFileRoute } from "@tanstack/react-router";
import { clientEnv } from "#/env/client";

export const Route = createFileRoute("/{-$locale}/policy/privacy")({
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
    <div className="flex min-h-svh flex-col justify-center">
      <BrandHeader />

      <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
        <h1 className="text-center text-4xl font-black text-highlight">
          Privacy
        </h1>
      </main>

      <Footer />
    </div>
  );
}
