import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

import { i18n } from "#/lib/i18n/config";
import {
  isSupportedLocale,
  persistLocale,
  resolveLocale,
} from "#/lib/i18n/detect-locale";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (params.locale && !isSupportedLocale(params.locale)) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  const resolvedLocale = resolveLocale(locale);

  useEffect(() => {
    if (i18n.language !== resolvedLocale) {
      void i18n.changeLanguage(resolvedLocale);
    }

    persistLocale(resolvedLocale);
    document.documentElement.lang = resolvedLocale;
  }, [resolvedLocale]);

  return <Outlet />;
}
