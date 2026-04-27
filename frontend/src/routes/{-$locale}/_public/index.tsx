import { createFileRoute, Link } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { clientEnv } from "#/env/client";
import { registerForBeta } from "#/lib/beta-signup.functions";
import { seoT } from "#/lib/i18n/seo";
import { authClient } from "#/lib/auth-client";

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

type SignupState = "idle" | "loading" | "success" | "error";

function BetaSignupSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SignupState>("idle");
  const { t } = useTranslation("landing");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");

    try {
      await registerForBeta({ data: { email } });
      setState("success");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <section
      id="android-beta"
      className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24"
    >
      <div className="w-full rounded-2xl border bg-card px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-12">
        <div className="mb-4 flex min-w-0 items-center gap-3">
          <Smartphone className="size-6 shrink-0 text-primary" />
          <span className="min-w-0 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("betaSignup.badge")}
          </span>
        </div>

        <h2 className="max-w-2xl text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          {t("betaSignup.title")}
        </h2>

        <p className="mt-3 max-w-lg text-pretty text-base leading-7 text-muted-foreground">
          {t("betaSignup.description")}
        </p>

        {state === "success" ? (
          <p className="mt-8 font-semibold text-primary">
            {t("betaSignup.success")}
          </p>
        ) : (
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              required
              placeholder={t("betaSignup.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === "loading"}
              className="min-w-0 flex-1"
            />

            <Button
              type="submit"
              disabled={state === "loading"}
              className="w-full sm:w-auto"
            >
              {state === "loading"
                ? t("betaSignup.submitting")
                : t("betaSignup.submit")}
            </Button>
          </form>
        )}

        {state === "error" && (
          <p className="mt-3 text-sm leading-6 text-destructive">
            {t("betaSignup.error")}
          </p>
        )}
      </div>
    </section>
  );
}

function LandingPage() {
  const { t } = useTranslation(["landing", "common"]);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <main className="min-w-0 flex-1 overflow-x-hidden">
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pt-28">
        <h1 className="max-w-5xl text-balance text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          {t("landing:hero.line1")} <br className="hidden sm:block" />
          {t("landing:hero.line2")}
          <span className="text-primary"> {t("landing:hero.highlight")}</span>
        </h1>

        <p className="my-6 max-w-full break-words text-balance text-5xl font-black leading-none text-highlight sm:text-7xl lg:text-8xl">
          {t("landing:hero.tagline")}
        </p>

        <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {t("landing:hero.description")}
        </p>

        <div className="mt-10 flex w-full flex-row flex-wrap gap-3">
          <Button size="lg" asChild>
            {user ? (
              <Link to="/{-$locale}/app/feed">
                {t("common:actions.openFeed")}
              </Link>
            ) : (
              <Link to="/{-$locale}/login">
                {t("common:actions.getStarted")}
              </Link>
            )}
          </Button>

          <Button size="lg" variant="outline" asChild>
            <a href="#android-beta">{t("landing:betaSignup.title")}</a>
          </Button>
        </div>
      </section>

      <BetaSignupSection />
    </main>
  );
}
