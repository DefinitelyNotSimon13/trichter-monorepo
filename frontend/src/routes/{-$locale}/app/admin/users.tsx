import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "#/components/admin/admin-users-page";

export const Route = createFileRoute("/{-$locale}/app/admin/users")({
  staticData: {
    breadcrumb: "Users",
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminUsersPage />;
}
