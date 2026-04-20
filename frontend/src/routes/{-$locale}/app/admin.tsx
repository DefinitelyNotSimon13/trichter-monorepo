import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { LocalizedLink } from "#/components/localized-link";
import { requireAdminSession } from "#/lib/auth.functions";
import { cn } from "#/lib/utils";

const NAV_ITEMS = [
  { to: "/app/admin" as const, label: "Dashboard", exact: true },
  { to: "/app/admin/users" as const, label: "Users", exact: false },
  { to: "/app/admin/runs" as const, label: "Runs", exact: false },
] as const;

function AdminNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex gap-1 border-b px-4 md:px-6">
      {NAV_ITEMS.map(({ to, label, exact }) => {
        const isActive = exact
          ? pathname.endsWith("/admin") || pathname.endsWith("/admin/")
          : pathname.includes(to.split("/app/admin")[1] ?? "");

        return (
          <LocalizedLink
            key={to}
            to={to}
            className={cn(
              "relative px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </LocalizedLink>
        );
      })}
    </nav>
  );
}

export const Route = createFileRoute("/{-$locale}/app/admin")({
  staticData: {
    breadcrumb: "Admin",
  },
  beforeLoad: async ({ location, params }) => {
    const result = await requireAdminSession();

    if (!result.ok && result.reason === "unauthenticated") {
      throw redirect({
        to: "/{-$locale}/login",
        params: {
          locale: params.locale,
        },
        search: {
          redirectTo: location.href,
        },
      });
    } else if (!result.ok && result.reason === "forbidden") {
      throw notFound();
    }

    return {
      user: result.session.user,
      session: result.session.session,
    };
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex flex-col">
      <AdminNav />
      <Outlet />
    </div>
  );
}
