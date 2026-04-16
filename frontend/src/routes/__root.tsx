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

import { Button } from "#/components/ui/button";
import { TooltipProvider } from "#/components/ui/tooltip";
import TanStackQueryDevtools from "#/integrations/tanstack-query/devtools";
import TanstackQueryProvider from "#/integrations/tanstack-query/root-provider";
import { normalizeLocale } from "#/lib/i18n/locale";
import appCss from "#/styles.css?url";
import { initI18n } from "#/lib/i18n/config";
import { Toaster } from "sonner";
import { createOauthClients } from "#/lib/auth.functions";

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
      <Button onClick={() => void router.navigate({ to: "/{-$locale}" })}>
        Go home
      </Button>
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Trichter" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
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

        {import.meta.env.DEV ? (
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        ) : null}

        <Scripts />
      </body>
    </html>
  );
}
