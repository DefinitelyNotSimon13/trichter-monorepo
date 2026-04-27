import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getRunsInfiniteOptions,
  getRunsInfiniteQueryKey,
} from "#/client/@tanstack/react-query.gen";
import type { RunDto } from "#/client/types.gen";
import { InfiniteScrollSentinel } from "#/components/runs/feed/infinite-scroll-sentinel";
import { RunFeed } from "#/components/runs/feed/run-feed";
import { Skeleton } from "#/components/ui/skeleton";
import { Spinner } from "#/components/ui/spinner";
import { StatePanel } from "#/components/ui/state-panel";
import { useWsEvent } from "#/hooks/use-ws-event";

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
  const { t } = useTranslation("app");
  return (
    <StatePanel tone="destructive" onRetry={reset}>
      {t("feed.loadError")} {error instanceof Error ? error.message : null}
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
  const queryClient = useQueryClient();
  const [pendingCount, setPendingCount] = useState(0);
  const { t } = useTranslation("app");

  useWsEvent("run.created", () => setPendingCount((c) => c + 1));

  const handleRefresh = () => {
    setPendingCount(0);
    void queryClient.resetQueries({ queryKey: getRunsInfiniteQueryKey() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        {t("feed.loadRunsError")}
      </StatePanel>
    );
  }

  if (query.isPending) {
    return <FeedSkeleton />;
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:items-start">
      {pendingCount > 0 && (
        <button
          type="button"
          onClick={handleRefresh}
          className="sticky top-2 z-10 flex w-full max-w-100 items-center justify-center gap-1.5 rounded-full border bg-background/95 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition-opacity hover:opacity-90"
        >
          {t("feed.newRuns", { count: pendingCount })}
        </button>
      )}
      <RunFeed runs={runs} />
      {query.isFetchingNextPage && (
        <StatePanel>
          <div className="flex gap-2">
            <Spinner />
            <span className="line-clamp-1">{t("feed.loadingMore")}</span>
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
