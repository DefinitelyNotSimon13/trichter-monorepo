import { createFileRoute } from "@tanstack/react-router";
import { AdminRunsPage } from "#/components/admin/admin-runs-page";

export const Route = createFileRoute("/{-$locale}/app/admin/runs")({
  staticData: {
    breadcrumb: "Runs",
  },
  component: AdminRunsPage,
});
