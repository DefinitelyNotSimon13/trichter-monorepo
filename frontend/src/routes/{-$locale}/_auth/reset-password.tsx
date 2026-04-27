import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { ResetPasswordForm } from "#/components/auth/reset-password-form";
import { getSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/{-$locale}/_auth/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  beforeLoad: async ({ params }) => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({
        to: "/{-$locale}/app/feed",
        params: { locale: params.locale },
      });
    }
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return (
    <AuthCardWrapper>
      <ResetPasswordForm className="w-full" />
    </AuthCardWrapper>
  );
}
