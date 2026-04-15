import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { requireAdminSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/{-$locale}/app/admin")({
	beforeLoad: async ({ location, params }) => {
		const result = await requireAdminSession();

		if (!result.ok) {
			throw redirect({
				to: "/{-$locale}/login",
				params: {
					locale: params.locale,
				},
				search: {
					redirect: location.href,
				},
			});
		}

		return {
			user: result.session.user,
			session: result.session.session,
		};
	},
	component: () => <Outlet />,
});
