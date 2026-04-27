import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/oauth/login")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/{-$locale}/login",
      params: { locale: params.locale },
      search: { mobile: true },
    });
  },
  component: () => null,
});
