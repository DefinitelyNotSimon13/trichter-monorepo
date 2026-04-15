import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

import { getRunsInfiniteOptions } from "#/client/@tanstack/react-query.gen";
import type { RunView } from "#/client/types.gen";

import { InfiniteScrollSentinel } from "#/components/runs/feed/infinite-scroll-sentinel";
import { RunFeed } from "#/components/runs/feed/run-feed";
import { Skeleton } from "#/components/ui/skeleton";
import { StatePanel } from "#/components/ui/state-panel";

const PAGE_SIZE = 10;

export const Route = createFileRoute("/{-$locale}/app/feed")({
  component: FeedPage,
});

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
            <Skeleton className="size-7 rounded-full shrink-0" />
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
      if (lastPage.last) return undefined;
      return (lastPage.number ?? 0) + 1;
    },
  });

  const runs = useMemo<RunView[]>(() => {
    return query.data?.pages.flatMap((page) => page.content ?? []) ?? [];
  }, [query.data]);

  const handleLoadMore = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    void query.fetchNextPage();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  if (query.isPending) return <FeedSkeleton />;
  if (query.isError)
    return (
      <StatePanel tone="destructive" onRetry={() => void query.refetch()}>
        Failed to load runs.
      </StatePanel>
    );

  return (
    <div className="flex flex-col items-center gap-6 lg:items-start">
      <RunFeed runs={runs} />
      <InfiniteScrollSentinel
        enabled={Boolean(query.hasNextPage)}
        onIntersect={handleLoadMore}
      />
      {query.isFetchingNextPage && <StatePanel>Loading more runs…</StatePanel>}
    </div>
  );
}
