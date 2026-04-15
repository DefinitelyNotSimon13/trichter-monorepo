import { Shield, User2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import type { AdminUser } from "./user-row-context-menu";

function roleToLabel(role: AdminUser["role"]) {
  if (Array.isArray(role)) return role.join(", ");
  return role || "user";
}

type Props = {
  total: number;
  pageUsers: AdminUser[];
};

export function UsersStatsCards({ total, pageUsers }: Props) {
  const admins = pageUsers.filter((u) =>
    roleToLabel(u.role).includes("admin"),
  ).length;
  const banned = pageUsers.filter((u) => !!u.banned).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total users</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{total}</div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admins on page</CardTitle>
          <Shield className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{admins}</div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Banned on page</CardTitle>
          <User2 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{banned}</div>
        </CardContent>
      </Card>
    </div>
  );
}
