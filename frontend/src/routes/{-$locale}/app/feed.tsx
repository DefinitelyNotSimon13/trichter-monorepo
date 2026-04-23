import { useInfiniteQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

import { getRunsInfiniteOptions } from "#/client/@tanstack/react-query.gen";
import type { RunDto } from "#/client/types.gen";

import { InfiniteScrollSentinel } from "#/components/runs/feed/infinite-scroll-sentinel";
import { RunFeed } from "#/components/runs/feed/run-feed";
import { Skeleton } from "#/components/ui/skeleton";
import { Spinner } from "#/components/ui/spinner";
import { StatePanel } from "#/components/ui/state-panel";

const PAGE_SIZE = 10;

export const Route = createFileRoute("/{-$locale}/app/feed")({
  staticData: {
    breadcrumb: "Feed",
  },
  // loader: ({ context: { queryClient, session } }) => {
  //   if (!session?.user) return;
  //   return queryClient.ensureInfiniteQueryData({
  //     ...getRunsInfiniteOptions({
  //       query: { size: PAGE_SIZE, sort: ["createdAt,desc"] },
  //     }),
  //     initialPageParam: 0,
  //   });
  // },
  pendingComponent: FeedSkeleton,
  errorComponent: FeedError,
  component: FeedPage,
});

function FeedError({ error, reset }: ErrorComponentProps) {
  return (
    <StatePanel tone="destructive" onRetry={reset}>
      Failed to load feed. {error instanceof Error ? error.message : null}
    </StatePanel>
  );
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          key={i}
          className="w-full max-w-100 overflow-hidden rounded-3xl border"
        >
          <div className="grid grid-cols-3 gap-3 p-3">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
          <div className="flex items-center gap-3 border-t px-5 py-3">
            <Skeleton className="size-7 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedPage() {
  const query = useInfiniteQuery({
    ...getRunsInfiniteOptions({
      query: {
        size: PAGE_SIZE,
        sort: ["createdAt,desc"],
      },
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pageNumber = lastPage.page?.number ?? 0;
      const totalPages = lastPage.page?.totalPages ?? 0;

      if (pageNumber + 1 >= totalPages) return undefined;
      return pageNumber + 1;
    },
  });

  const runs = useMemo<RunDto[]>(() => {
    return query.data?.pages.flatMap((page) => page.content ?? []) ?? [];
  }, [query.data]);

  const handleLoadMore = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    void query.fetchNextPage();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  if (query.isError) {
    return (
      <StatePanel tone="destructive" onRetry={() => void query.refetch()}>
        Failed to load runs.
      </StatePanel>
    );
  }

  if (query.isPending) {
    return <FeedSkeleton />;
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:items-start">
      <RunFeed runs={runs} />
      {query.isFetchingNextPage && (
        <StatePanel>
          <div className="flex gap-2">
            <Spinner />
            <span className="line-clamp-1">Loading more runs…</span>
          </div>
        </StatePanel>
      )}
      <InfiniteScrollSentinel
        enabled={Boolean(query.hasNextPage)}
        onIntersect={handleLoadMore}
      />
    </div>
  );
}
