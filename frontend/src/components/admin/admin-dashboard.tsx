import { useQuery } from "@tanstack/react-query";
import { Activity, Users } from "lucide-react";
import { getRunsOptions } from "#/client/@tanstack/react-query.gen";
import { LocalizedLink } from "#/components/localized-link";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { listUsers } from "#/lib/admin";
import { formatDateTime, formatRate, formatVolume } from "#/lib/formatters";

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-semibold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const usersQuery = useQuery({
    queryKey: ["admin-users-count"],
    queryFn: () => listUsers({ limit: 1, offset: 0 }),
  });

  const runsQuery = useQuery({
    ...getRunsOptions({ query: { size: 5, sort: ["createdAt,desc"] } }),
  });

  const totalUsers = usersQuery.data?.total ?? 0;
  const totalRuns = runsQuery.data?.totalElements ?? 0;
  const recentRuns = runsQuery.data?.content ?? [];

  return (
    <section className="space-y-6 p-4 md:p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Overview of users and activity.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total users"
          value={totalUsers}
          icon={Users}
          isLoading={usersQuery.isLoading}
        />
        <StatCard
          title="Total runs"
          value={totalRuns}
          icon={Activity}
          isLoading={runsQuery.isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent runs</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <LocalizedLink to="/app/admin/runs">View all</LocalizedLink>
            </Button>
          </CardHeader>
          <CardContent>
            {runsQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <Skeleton key={i} className="h-8 rounded-lg" />
                ))}
              </div>
            ) : recentRuns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No runs yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell className="font-medium">
                          {run.user?.name ?? run.user?.username ?? "—"}
                        </TableCell>
                        <TableCell>{formatRate(run.data?.rate)}</TableCell>
                        <TableCell>{formatVolume(run.data?.volume)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {run.createdAt ? formatDateTime(run.createdAt) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Quick access</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <LocalizedLink to="/app/admin/users">
                <Users className="mr-2 size-4" />
                Manage users
              </LocalizedLink>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <LocalizedLink to="/app/admin/runs">
                <Activity className="mr-2 size-4" />
                Manage runs
              </LocalizedLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
