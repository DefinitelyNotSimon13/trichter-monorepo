import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/oauth/callback")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Stand by for redirection...</div>;
}
