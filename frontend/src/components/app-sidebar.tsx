import { Link, useRouterState } from "@tanstack/react-router";
import { CircleUser, Rss, Trophy } from "lucide-react";

import { useTheme } from "#/hooks/use-theme";
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
import { resolveLocale } from "#/lib/i18n/detect-locale";

const navItems = [
  { to: "/app/feed", icon: Rss, label: "Feed" },
  { to: "/app/leaderboard", icon: Trophy, label: "Leaderboard" },
] as const;

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

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const matches = useRouterState({ select: (s) => s.matches });
  const localeMatch = matches.find((m) => "locale" in (m.params ?? {}));
  const locale = resolveLocale(localeMatch?.params?.locale);

  return (
    <Sidebar collapsible="icon">
      <SidebarLogo locale={locale} />

      <SidebarContent className="justify-center">
        <SidebarMenu className="px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(to)}
                tooltip={label}
              >
                <Link to={to} viewTransition>
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
          <SidebarMenuItem>
            <SidebarMenuButton disabled tooltip="Profile (coming soon)">
              <CircleUser />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                Profile
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarThemeButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
