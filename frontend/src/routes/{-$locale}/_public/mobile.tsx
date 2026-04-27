import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/{-$locale}/_public/mobile")({
  head: () => ({
    meta: [
      { title: "Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation("app");
  return (
    <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
      <h1 className="text-center text-4xl font-black text-primary">
        {t("mobile.success")}
      </h1>
      <a
        href="trichter://oauth/callback"
        className="py-5 text-xl bold underline"
      >
        {t("mobile.returnToApp")}
      </a>
      <p className="text-center max-w-100 italic">{t("mobile.restartHint")}</p>
    </main>
  );
}
