import { createFileRoute } from "@tanstack/react-router";
import { Rss, Smartphone, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

import { BrandHeader } from "#/components/brand-header";
import { Footer } from "#/components/footer";
import { Button } from "#/components/ui/button";
import { LocalizedLink } from "#/components/localized-link";
import { clientEnv } from "#/env/client";
import { seoT } from "#/lib/i18n/seo";

export const Route = createFileRoute("/{-$locale}/")({
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
    <div className="flex min-h-svh flex-col">
      <BrandHeader />

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
              <LocalizedLink to="/app/feed">
                {t("common:actions.openFeed")}
              </LocalizedLink>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <LocalizedLink to="/app/leaderboard">
                {t("common:actions.viewLeaderboard")}
              </LocalizedLink>
            </Button>
          </div>
        </section>

        {/*      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl bg-primary/10 p-8">
              <Rss className="mb-4 size-7 text-primary" />
              <h2 className="text-lg font-bold">
                {t("landing:cards.feed.title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("landing:cards.feed.description")}
              </p>
            </article>

            <article
              className="rounded-3xl p-8"
              style={{
                backgroundColor:
                  "color-mix(in oklch, var(--highlight) 18%, transparent)",
              }}
            >
              <Trophy
                className="mb-4 size-7"
                style={{ color: "var(--highlight)" }}
              />
              <h2 className="text-lg font-bold">
                {t("landing:cards.leaderboard.title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("landing:cards.leaderboard.description")}
              </p>
            </article>

            <article className="rounded-3xl bg-muted p-8">
              <Smartphone className="mb-4 size-7 text-muted-foreground" />
              <h2 className="text-lg font-bold">
                {t("landing:cards.comingSoon.title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("landing:cards.comingSoon.description")}
              </p>
            </article>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  );
}
