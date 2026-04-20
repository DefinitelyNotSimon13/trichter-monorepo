import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/oauth/login")({
  beforeLoad: () => {
    throw redirect({ to: "/{-$locale}/login", search: { mobile: true } });
  },
  component: () => null,
});
