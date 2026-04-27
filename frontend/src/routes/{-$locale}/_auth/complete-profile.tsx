import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { CompleteProfileForm } from "#/components/auth/complete-profile-form";
import { getSession } from "#/lib/auth.functions";
import { z } from "zod/mini";

export const Route = createFileRoute("/{-$locale}/_auth/complete-profile")({
  head: () => ({
    meta: [
      { title: "Complete Profile | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: z.object({
    callbackUrl: z.optional(z.string()),
  }),
  beforeLoad: async ({ params }) => {
    const session = await getSession();

    if (!session?.user) {
      throw redirect({
        to: "/{-$locale}/login",
        params: { locale: params.locale },
      });
    }

    return { session };
  },
  component: CompleteProfilePage,
});

function CompleteProfilePage() {
  const { session } = Route.useRouteContext();
  const { callbackUrl } = Route.useSearch();

  return (
    <AuthCardWrapper>
      <CompleteProfileForm user={session.user} callbackUrl={callbackUrl} />
    </AuthCardWrapper>
  );
}
