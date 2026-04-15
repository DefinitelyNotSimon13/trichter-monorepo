import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { LoginForm } from "#/components/auth/login-form";

export const Route = createFileRoute("/{-$locale}/_auth/login")({
	validateSearch: z.object({
		redirectTo: z.string().optional(),
	}),
	component: LoginPage,
});

function LoginPage() {
	const { locale } = Route.useParams();
	const { redirectTo } = Route.useSearch();

	return (
		<AuthCardWrapper locale={locale ?? ""}>
			<LoginForm locale={locale ?? ""} redirectTo={redirectTo} />
		</AuthCardWrapper>
	);
}
