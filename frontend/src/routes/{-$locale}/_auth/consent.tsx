import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_auth/consent")({
  head: () => ({
    meta: [
      { title: "Authorize | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/-$locale/_auth/consent"!</div>;
}
