import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { CircleUser, LogOut, Rss, Trophy } from "lucide-react";
import { AppSidebar } from "#/components/app-sidebar";
import { PageWrapper } from "#/components/page-wrapper";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { useRouteLocale } from "#/hooks/use-route-locale";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/{-$locale}/app")({
	component: AppLayout,
});

const PAGE_NAMES: Record<string, string> = {
	"/app/feed": "Feed",
	"/app/leaderboard": "Leaderboard",
	"/app/profile": "Profile",
};

function AppHeader() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();
	const locale = useRouteLocale();

	const pageName =
		Object.entries(PAGE_NAMES).find(([key]) => pathname.includes(key))?.[1] ??
		"App";

	const handleSignOut = async () => {
		await authClient.signOut();
		await navigate({
			to: "/{-$locale}",
			params: { locale },
			replace: true,
		});
	};

	return (
		<header className="flex h-14 items-center gap-3 border-b px-4">
			<SidebarTrigger className="-ml-1 hidden md:flex" />

			<Breadcrumb className="min-w-0 flex-1">
				<BreadcrumbList>
					<BreadcrumbItem className="text-muted-foreground">App</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{pageName}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{session?.user ? (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => void handleSignOut()}
					className="md:hidden"
				>
					<LogOut className="size-4" />
					<span className="sr-only">Log out</span>
				</Button>
			) : null}
		</header>
	);
}

function MobileNavLink({
	to,
	activePath,
	icon,
	label,
}: {
	to: "/{-$locale}/app/feed" | "/{-$locale}/app/leaderboard";
	activePath: string;
	icon: React.ReactNode;
	label: string;
}) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const locale = useRouteLocale();
	const isActive = pathname.includes(activePath);

	return (
		<Link
			to={to}
			params={{ locale }}
			viewTransition
			className={cn(
				"flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors",
				isActive
					? "text-primary"
					: "text-muted-foreground hover:text-foreground",
			)}
		>
			{icon}
			<span>{label}</span>
		</Link>
	);
}

function MobileBottomNav() {
	const { data: session } = authClient.useSession();
	const locale = useRouteLocale();

	return (
		<nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background/95 backdrop-blur md:hidden">
			<MobileNavLink
				to="/{-$locale}/app/feed"
				activePath="/app/feed"
				icon={<Rss className="size-5" />}
				label="Feed"
			/>
			<MobileNavLink
				to="/{-$locale}/app/leaderboard"
				activePath="/app/leaderboard"
				icon={<Trophy className="size-5" />}
				label="Board"
			/>
			{session?.user ? (
				<Link
					to="/{-$locale}/app/profile"
					params={{ locale }}
					viewTransition
					className={cn(
						"flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-foreground",
					)}
				>
					<CircleUser className="size-5" />
					<span>Profile</span>
				</Link>
			) : (
				<button
					type="button"
					disabled
					className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold text-muted-foreground"
				>
					<CircleUser className="size-5" />
					<span>Profile</span>
				</button>
			)}
		</nav>
	);
}

function AppLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<main className="mx-auto w-full max-w-4xl px-4 py-8 pb-24 sm:px-6 md:pb-8">
					<PageWrapper>
						<Outlet />
					</PageWrapper>
				</main>
			</SidebarInset>
			<MobileBottomNav />
		</SidebarProvider>
	);
}
