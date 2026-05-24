import interLatinFont from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";
import { Button } from "#/components/ui/button";
import { TooltipProvider } from "#/components/ui/tooltip";
import { clientEnv } from "#/env/client";
import TanStackQueryDevtools from "#/integrations/tanstack-query/devtools";
import TanstackQueryProvider from "#/integrations/tanstack-query/root-provider";
import { initI18n } from "#/lib/i18n/config";
import { normalizeLocale } from "#/lib/i18n/locale";
import appCss from "#/styles.css?url";
import "#/lib/api-setup";
import { RootDevtools } from "#/integrations/tanstack-devtools/root-devtools";

interface RouterContext {
  queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button onClick={() => void router.navigate({ to: "/" })}>Go home</Button>
    </div>
  );
}

function ErrorPage({ error }: { error: Error }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Error
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error?.message ?? "An unexpected error occurred."}
        </p>
      </div>
      <Button onClick={() => window.location.reload()}>Reload page</Button>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    // await createOauthClients();
  },
  head: () => {
    const siteUrl = clientEnv.VITE_PUBLIC_URL;
    const ogImage = `${siteUrl}/og-image.svg`;
    const description =
      "Track your runs, climb the leaderboard, and share the glory with your friends.";

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Trichter" },
        { name: "description", content: description },
        // OpenGraph
        { property: "og:site_name", content: "Trichter" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Trichter" },
        { property: "og:description", content: description },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        // Twitter / X
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Trichter" },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: interLatinFont,
          crossOrigin: "anonymous",
        },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        // hrefLang — root-level so present on every page
        { rel: "alternate", hrefLang: "x-default", href: siteUrl },
        { rel: "alternate", hrefLang: "en", href: `${siteUrl}/en` },
        { rel: "alternate", hrefLang: "de", href: `${siteUrl}/de` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                name: "Trichter",
                url: siteUrl,
                description,
              },
              {
                "@type": "SoftwareApplication",
                name: "Trichter",
                applicationCategory: "SportsApplication",
                operatingSystem: "Web",
                url: siteUrl,
                description,
              },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error }) => <ErrorPage error={error as Error} />,
  shellComponent: RootDocument,
});

function RootDocument() {
  const context = Route.useRouteContext();
  const matches = useRouterState({ select: (s) => s.matches });

  const localeMatch = matches.find(
    (m): m is typeof m & { params: { locale?: string } } =>
      "locale" in (m.params ?? {}),
  );
  const locale = normalizeLocale(localeMatch?.params.locale);

  const i18n = initI18n(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <TanstackQueryProvider queryClient={context.queryClient}>
          <I18nextProvider i18n={i18n}>
            <TooltipProvider>
              <Outlet />
              <Toaster />
            </TooltipProvider>
          </I18nextProvider>
        </TanstackQueryProvider>

        {import.meta.env.DEV ? <RootDevtools /> : null}

        <Scripts />
      </body>
    </html>
  );
}
