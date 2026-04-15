import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { CircleUser, LogIn, LogOut, Rss, Trophy } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "#/components/ui/sidebar";
import { useRouteLocale } from "#/hooks/use-route-locale";
import { useTheme } from "#/hooks/use-theme";
import { authClient } from "#/lib/auth-client";

const navItems = [
	{
		to: "/{-$locale}/app/feed" as const,
		activePath: "/app/feed",
		icon: Rss,
		label: "Feed",
	},
	{
		to: "/{-$locale}/app/leaderboard" as const,
		activePath: "/app/leaderboard",
		icon: Trophy,
		label: "Leaderboard",
	},
];

function SidebarLogo(props: { locale: string | undefined }) {
	const { state } = useSidebar();
	const { locale } = props;

	return (
		<SidebarHeader className="border-b px-4 py-4">
			<Link
				to="/{-$locale}"
				params={{ locale }}
				className="font-black tracking-tight text-foreground"
			>
				{state === "collapsed" ? "T" : "Trichter"}
			</Link>
		</SidebarHeader>
	);
}

function SidebarThemeButton() {
	const { mode, toggle, icon: Icon } = useTheme();
	const label =
		mode === "auto"
			? "Theme: Auto"
			: mode === "dark"
				? "Theme: Dark"
				: "Theme: Light";

	return (
		<SidebarMenuButton onClick={toggle} tooltip={label}>
			<Icon />
			<span className="truncate group-data-[collapsible=icon]:hidden">
				{label}
			</span>
		</SidebarMenuButton>
	);
}

function SidebarUserSection(props: { locale: string | undefined }) {
	const navigate = useNavigate();
	const { state } = useSidebar();
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user;

	const profileLabel = user?.name?.trim() || user?.email || "Profile";

	const handleSignOut = async () => {
		await authClient.signOut();
		await navigate({
			to: "/{-$locale}",
			params: { locale: props.locale },
			replace: true,
		});
	};

	if (isPending) {
		return (
			<>
				<SidebarMenuItem>
					<SidebarMenuButton disabled tooltip="Loading profile">
						<CircleUser />
						<span className="truncate group-data-[collapsible=icon]:hidden">
							Loading...
						</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarThemeButton />
				</SidebarMenuItem>
			</>
		);
	}

	if (!user) {
		return (
			<>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						tooltip="Log In"
						className="h-auto min-h-11"
					>
						<Link
							to="/{-$locale}/login"
							params={{ locale: props.locale }}
							viewTransition
						>
							<LogIn />
							<span className="leading-[normal] truncate group-data-[collapsible=icon]:hidden">
								{state === "collapsed" ? "Log In" : "Log In"}
							</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarThemeButton />
				</SidebarMenuItem>
			</>
		);
	}

	return (
		<>
			<SidebarMenuItem>
				<SidebarMenuButton
					asChild
					tooltip={profileLabel}
					className="h-auto min-h-11"
				>
					<Link
						to="/{-$locale}/app/profile"
						params={{ locale: props.locale }}
						viewTransition
					>
						<CircleUser />
						<span className="truncate group-data-[collapsible=icon]:hidden">
							{state === "collapsed" ? "Profile" : profileLabel}
						</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>

			<SidebarMenuItem>
				<SidebarMenuButton
					onClick={() => void handleSignOut()}
					tooltip="Log out"
				>
					<LogOut />
					<span className="truncate group-data-[collapsible=icon]:hidden">
						Log out
					</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
			<SidebarMenuItem>
				<SidebarThemeButton />
			</SidebarMenuItem>
		</>
	);
}

export function AppSidebar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const locale = useRouteLocale();

	return (
		<Sidebar collapsible="icon">
			<SidebarLogo locale={locale} />

			<SidebarContent className="justify-center">
				<SidebarMenu className="px-2">
					{navItems.map(({ to, activePath, icon: Icon, label }) => (
						<SidebarMenuItem key={to}>
							<SidebarMenuButton
								asChild
								isActive={pathname.startsWith(activePath)}
								tooltip={label}
							>
								<Link to={to} params={{ locale }} viewTransition>
									<Icon />
									<span className="truncate group-data-[collapsible=icon]:hidden">
										{label}
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="border-t">
				<SidebarMenu>
					<SidebarUserSection locale={locale} />
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
