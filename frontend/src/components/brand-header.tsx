import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import { useTheme } from "#/hooks/use-theme";
import { authClient } from "#/lib/auth-client";
import { Spinner } from "./ui/spinner";
import { LogOut, Settings2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "./ui/dropdown-menu";

function IconThemeToggle() {
  const { toggle, icon: Icon } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full p-2 transition-colors hover:bg-muted"
      aria-label="Toggle theme"
    >
      <Icon className="size-4" />
    </button>
  );
}

export function BrandHeader() {
  const { t } = useTranslation(["common"]);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // hard redirect avoids stale client state
            window.location.href = "/";
          },
        },
      });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/{-$locale}"
          className="text-base font-black tracking-tight text-foreground"
        >
          {t("common:appName")}
        </Link>

        <div className="flex items-center gap-3">
          <IconThemeToggle />
          {isPending ? (
            <Button size="sm" disabled>
              <Spinner className="w-12" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="text-primary" variant="link">
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: "/{-$locale}/app/profile/{-$userId}",
                        params: {
                          userId: user.id,
                        },
                      })
                    }
                  >
                    <User />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: "/{-$locale}/app/settings",
                      })
                    }
                  >
                    <p className="flex gap-2">
                      <Settings2 />
                      Account Settings
                    </p>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="ghost" asChild>
              <Link to="/{-$locale}/login">{t("common:auth.signIn")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
