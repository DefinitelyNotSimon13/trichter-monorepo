import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/oauth")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Why are you here???</div>;
}
