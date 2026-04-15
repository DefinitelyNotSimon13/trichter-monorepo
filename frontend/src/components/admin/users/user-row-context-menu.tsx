import type { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "#/components/ui/context-menu";

type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: boolean | null;
  image?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  role?: string | string[] | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | Date | null;
  username?: string | null;
  displayUsername?: string | null;
  lastActiveAt?: string | Date | null;
};

type Actions = {
  onEdit: (user: AdminUser) => void;
  onSessions: (user: AdminUser) => void;
  onMakeAdmin: (user: AdminUser) => void;
  onMakeUser: (user: AdminUser) => void;
  onBan: (user: AdminUser) => void;
  onUnban: (user: AdminUser) => void;
  onImpersonate: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

type Props = {
  user: AdminUser;
  actions: Actions;
  children: ReactNode;
};

export function UserRowContextMenu({ user, actions, children }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onClick={() => actions.onEdit(user)}>
          Edit user
        </ContextMenuItem>
        <ContextMenuItem onClick={() => actions.onSessions(user)}>
          View sessions
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => actions.onMakeAdmin(user)}>
          Make admin
        </ContextMenuItem>
        <ContextMenuItem onClick={() => actions.onMakeUser(user)}>
          Make user
        </ContextMenuItem>
        <ContextMenuSeparator />
        {user.banned ? (
          <ContextMenuItem onClick={() => actions.onUnban(user)}>
            Unban user
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={() => actions.onBan(user)}>
            Ban user
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => actions.onImpersonate(user)}>
          Impersonate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => actions.onDelete(user)}
        >
          Delete user
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export type { AdminUser };
