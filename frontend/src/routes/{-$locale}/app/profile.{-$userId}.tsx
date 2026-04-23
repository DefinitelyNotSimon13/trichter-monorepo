import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { getRunsByUserOptions } from "#/client/@tanstack/react-query.gen";
import { ProfileRunsPreview } from "#/components/profile/profile-runs-preview";
import { ProfileStats } from "#/components/profile/profile-stats";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Skeleton } from "#/components/ui/skeleton";
import { StatePanel } from "#/components/ui/state-panel";
import { getSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/{-$locale}/app/profile/{-$userId}")({
  staticData: {
    breadcrumb: "Profile",
  },
  loader: ({ context: { queryClient, userId } }) =>
    queryClient.ensureQueryData(
      getRunsByUserOptions({
        path: { userId },
        query: { size: 500, sort: ["createdAt,desc"] },
      }),
    ),
  pendingComponent: ProfileSkeleton,
  errorComponent: ProfileError,
  beforeLoad: async ({ params, location }) => {
    if (params.userId) {
      return {
        userId: params.userId,
        user: null,
      };
    }

    const session = await getSession();

    const user = session?.user;
    const currentUserId = user?.id;
    if (!user || !currentUserId) {
      throw redirect({
        to: "/{-$locale}/login",
        params: {
          locale: params.locale,
        },
        search: {
          redirectTo: location.href,
        },
      });
    }

    return {
      userId: currentUserId,
      user: user,
    };
  },
  component: PublicProfilePage,
});

function ProfileError({ error, reset }: ErrorComponentProps) {
  return (
    <StatePanel tone="destructive" onRetry={reset}>
      Failed to load profile. {error instanceof Error ? error.message : null}
    </StatePanel>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function PublicProfilePage() {
  const { userId } = Route.useRouteContext();

  const { data } = useSuspenseQuery(
    getRunsByUserOptions({
      path: { userId },
      query: { size: 500, sort: ["createdAt,desc"] },
    }),
  );

  const runs = data.content ?? [];

  const userInfo = runs[0]?.user;
  const displayName = userInfo?.name ?? userInfo?.username ?? userId;
  const initial = displayName[0]?.toUpperCase() ?? "?";

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="text-xl font-bold bg-primary/15 text-primary">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {displayName}
          </h1>
          {userInfo?.username ? (
            <p className="text-sm text-muted-foreground">
              @{userInfo.username}
            </p>
          ) : null}
        </div>
      </header>
      <ProfileStats runs={runs} />
      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          Recent runs
        </h2>
        <ProfileRunsPreview runs={runs} count={5} />
      </div>
    </section>
  );
}
