import { createFileRoute } from "@tanstack/react-router";
import { AdminBetaPage } from "#/components/admin/admin-beta-page";

export const Route = createFileRoute("/{-$locale}/app/admin/beta")({
  staticData: {
    breadcrumb: "Beta",
  },
  component: AdminBetaPage,
});
