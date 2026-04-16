import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_auth/consent")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/-$locale/_auth/consent"!</div>;
}
