import { Outlet, Link, createFileRoute, useRouterState } from "@tanstack/react-router";
import { CircleUser, Rss, Trophy } from "lucide-react";

import { AppSidebar } from "#/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/{-$locale}/app")({
	component: AppLayout,
});

const PAGE_NAMES: Record<string, string> = {
	"/app/feed": "Feed",
	"/app/leaderboard": "Leaderboard",
};

function AppHeader() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const pageName = PAGE_NAMES[pathname] ?? "App";

	return (
		<header className="flex h-14 items-center gap-3 border-b px-4">
			<SidebarTrigger className="-ml-1 hidden md:flex" />
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem className="text-muted-foreground">App</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{pageName}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	);
}

function MobileNavLink({
	to,
	icon,
	label,
}: {
	to: string;
	icon: React.ReactNode;
	label: string;
}) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isActive = pathname.startsWith(to);

	return (
		<Link
			to={to}
			viewTransition
			className={cn(
				"flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors",
				isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
			)}
		>
			{icon}
			<span>{label}</span>
		</Link>
	);
}

function MobileBottomNav() {
	return (
		<nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background md:hidden">
			<MobileNavLink
				to="/app/feed"
				icon={<Rss className="size-5" />}
				label="Feed"
			/>
			<MobileNavLink
				to="/app/leaderboard"
				icon={<Trophy className="size-5" />}
				label="Board"
			/>
			<button
				disabled
				className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold text-muted-foreground"
			>
				<CircleUser className="size-5" />
				<span>Profile</span>
			</button>
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
					<Outlet />
				</main>
			</SidebarInset>
			<MobileBottomNav />
		</SidebarProvider>
	);
}
