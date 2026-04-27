import {
  createLazyFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { CircleUser, LogOut, Rss, Settings2, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "#/components/app-sidebar";
import { PasskeyPromptDialog } from "#/components/auth/passkey-prompt-dialog";
import { PageWrapper } from "#/components/page-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "#/components/ui/sidebar";
import { WebSocketProvider } from "#/components/websocket-provider";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";

export const Route = createLazyFileRoute("/{-$locale}/app")({
  component: AppLayout,
});

function AppHeader() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const matches = useRouterState({ select: (s) => s.matches });

  const breadcrumbs = matches
    .map((match) => {
      const breadcrumb = (
        match.staticData as { breadcrumb?: string } | undefined
      )?.breadcrumb;

      if (!breadcrumb) return null;

      return {
        id: match.id,
        href: match.routeId.toString(),
        label: breadcrumb,
      };
    })
    .filter(
      (item): item is { id: string; href: string; label: string } =>
        item !== null,
    );

  const handleSignOut = async () => {
    await authClient.signOut();
    await navigate({
      to: "/{-$locale}",
      replace: true,
    });
  };

  return (
    <header className="flex h-14 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1 hidden md:flex" />

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList>
          <BreadcrumbItem className="text-muted-foreground">
            <Link to="/{-$locale}" className="hover:underline">
              Trichter
            </Link>
          </BreadcrumbItem>{" "}
          <BreadcrumbSeparator />
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <React.Fragment key={crumb.id}>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <Link to={crumb.href} className="hover:underline">
                      {crumb.label}
                    </Link>
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {!isLast ? <BreadcrumbSeparator /> : null}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {session?.user ? (
        <div className="flex items-center gap-1">
          <Link to="/{-$locale}/app/settings">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
            >
              <Settings2 className="size-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => void handleSignOut()}
            className="size-8 md:hidden"
          >
            <LogOut className="size-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      ) : null}
    </header>
  );
}

function MobileNavLink({
  to,
  activePath,
  icon,
  label,
}: {
  to:
    | "/{-$locale}/app/feed"
    | "/{-$locale}/app/leaderboard"
    | "/{-$locale}/app/profile";
  activePath: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname.includes(activePath);

  return (
    <Link
      to={to}
      viewTransition
      className={cn(
        "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background/95 backdrop-blur md:hidden">
      <MobileNavLink
        to="/{-$locale}/app/feed"
        activePath="/app/feed"
        icon={<Rss className="size-5" />}
        label="Feed"
      />
      <MobileNavLink
        to="/{-$locale}/app/leaderboard"
        activePath="/app/leaderboard"
        icon={<Trophy className="size-5" />}
        label="Board"
      />
      <MobileNavLink
        to="/{-$locale}/app/profile"
        activePath="/app/profile"
        icon={<CircleUser className="size-5" />}
        label="Profile"
      />
    </nav>
  );
}

function AppLayout() {
  const { newUser } = Route.useSearch();
  const [showPasskeyDialog, setShowPasskeyDialog] = useState(false);

  useEffect(() => {
    if (
      newUser === true &&
      typeof window !== "undefined" &&
      window.PublicKeyCredential &&
      !localStorage.getItem("passkey-prompt-dismissed")
    ) {
      setShowPasskeyDialog(true);
    }
  }, [newUser]);

  return (
    <WebSocketProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="mx-auto w-full max-w-4xl px-4 py-8 pb-24 sm:px-6 md:pb-8">
            <PageWrapper>
              <Outlet />
              <PasskeyPromptDialog
                open={showPasskeyDialog}
                onOpenChange={setShowPasskeyDialog}
              />
            </PageWrapper>
          </main>
        </SidebarInset>
        <MobileBottomNav />
      </SidebarProvider>
    </WebSocketProvider>
  );
}
