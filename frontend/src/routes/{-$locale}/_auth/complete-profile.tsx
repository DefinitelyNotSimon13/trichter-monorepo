import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { CompleteProfileForm } from "#/components/auth/complete-profile-form";
import { getSession } from "#/lib/auth.functions";
import z from "zod";

export const Route = createFileRoute("/{-$locale}/_auth/complete-profile")({
  validateSearch: z.object({
    callbackUrl: z.string().optional(),
  }),
  beforeLoad: async () => {
    const session = await getSession();

    if (!session?.user) {
      throw redirect({ to: "/{-$locale}/login" });
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
