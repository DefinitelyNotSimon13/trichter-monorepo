import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { PageWrapper } from "#/components/page-wrapper";
import {
  detectClientLocale,
  isSupportedLocale,
  normalizeLocale,
  persistLocale,
} from "#/lib/i18n/locale";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (params.locale && !isSupportedLocale(params.locale)) {
      throw notFound();
    }

    return {
      locale: normalizeLocale(params.locale),
    };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  const context = Route.useRouteContext();

  const routeLocale = context.locale;

  useEffect(() => {
    if (!locale) {
      return;
    }

    persistLocale(routeLocale);
    document.documentElement.lang = routeLocale;
  }, [locale, routeLocale]);

  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
}
