import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/{-$locale}/_public/goodbye")({
  head: () => ({
    meta: [
      { title: "Goodbye | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation("app");
  return (
    <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
      <h1 className="text-center text-4xl font-black text-highlight">
        {t("goodbye.title")}
      </h1>
      <Link to="/{-$locale}" className="underline">
        {t("goodbye.homepage")}
      </Link>
    </main>
  );
}
