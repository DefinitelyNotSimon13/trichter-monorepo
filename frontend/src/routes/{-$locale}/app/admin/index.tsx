import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "#/components/admin/admin-dashboard";

export const Route = createFileRoute("/{-$locale}/app/admin/")({
  component: AdminDashboard,
});
