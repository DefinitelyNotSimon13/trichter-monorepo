import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { CompleteProfileForm } from "#/components/auth/complete-profile-form";
import { getSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/{-$locale}/_auth/complete-profile")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session?.user) {
      throw redirect({ to: "/{-$locale}/login" });
    }

    if (session.user.username) {
      throw redirect({ to: "/{-$locale}/app/feed", search: {} });
    }
  },
  component: CompleteProfilePage,
});

function CompleteProfilePage() {
  return (
    <AuthCardWrapper>
      <CompleteProfileForm />
    </AuthCardWrapper>
  );
}
