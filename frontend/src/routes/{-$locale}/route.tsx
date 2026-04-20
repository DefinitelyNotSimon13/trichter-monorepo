import {
  createFileRoute,
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
      throw redirect({
        to: "/{-$locale}",
      });
    }

    return {
      locale: normalizeLocale(params.locale),
    };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const { locale } = Route.useParams();
  const context = Route.useRouteContext();

  const routeLocale = context.locale;

  // useEffect(() => {
  //   if (!locale) {
  //     const detected = detectClientLocale();
  //     const prefix = `/${detected}`;
  //     const href = location.publicHref;
  //     const alreadyNormalized =
  //       href === prefix || href.startsWith(`${prefix}/`);
  //
  //     if (!alreadyNormalized) {
  //       void navigate({
  //         href: `${prefix}${href}`,
  //         replace: true,
  //       });
  //       return;
  //     }
  //   }
  //
  //   persistLocale(routeLocale);
  //   document.documentElement.lang = routeLocale;
  // }, [locale, routeLocale, location.publicHref, navigate]);

  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
}
