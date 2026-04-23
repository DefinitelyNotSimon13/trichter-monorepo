import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "#/components/ui/button";
import { clientEnv } from "#/env/client";
import { seoT } from "#/lib/i18n/seo";

export const Route = createFileRoute("/{-$locale}/_public/")({
  head: ({ params }) => {
    const locale = params.locale;
    const description = seoT(locale, "landing", "hero.description");
    const title = "Trichter — Competitive Drinking";
    const siteUrl = clientEnv.VITE_PUBLIC_URL;
    const pageUrl = locale ? `${siteUrl}/${locale}` : siteUrl;
    const ogImage = `${siteUrl}/og-image.svg`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: pageUrl },
        { property: "og:image", content: ogImage },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
    };
  },
  component: LandingPage,
});

function LandingPage() {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 lg:pt-28">
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
          {t("landing:hero.line1")} <br />
          {t("landing:hero.line2")}
          <span className="text-primary"> {t("landing:hero.highlight")}</span>
        </h1>

        <p className="my-6 text-6xl font-black leading-none text-highlight sm:text-7xl lg:text-8xl">
          {t("landing:hero.tagline")}
        </p>

        <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
          {t("landing:hero.description")}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link to="/{-$locale}/app/feed">
              {t("common:actions.openFeed")}
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link to="/{-$locale}/app/leaderboard">
              {t("common:actions.viewLeaderboard")}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
