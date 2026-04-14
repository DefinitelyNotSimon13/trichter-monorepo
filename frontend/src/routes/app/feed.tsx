import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getRunsInfiniteOptions } from "#/client/@tanstack/react-query.gen";
import type { RunView } from "#/client/types.gen";

import { InfiniteScrollSentinel } from "#/components/runs/feed/infinite-scroll-sentinel";
import { RunFeed } from "#/components/runs/feed/run-feed";

const PAGE_SIZE = 10;

export const Route = createFileRoute("/app/feed")({
  component: FeedPage,
});

function FeedPageHeader() {
  return (
    <header className="border-b pb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        App
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Feed</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Latest runs, newest first.
      </p>
    </header>
  );
}

function FeedPageShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start items-center">
      <aside className="lg:sticky lg:top-30">
        <FeedPageHeader />
      </aside>

      <div className="min-w-0 space-y-6">{children}</div>
    </section>
  );
}

function FeedStatePanel({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "destructive";
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-dashed p-8 text-sm",
        tone === "destructive" ? "text-destructive" : "text-muted-foreground",
      ].join(" ")}
    >
      {children}
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
      if (lastPage.last) {
        return undefined;
      }

      return (lastPage.number ?? 0) + 1;
    },
  });

  const runs = useMemo<RunView[]>(() => {
    return query.data?.pages.flatMap((page) => page.content ?? []) ?? [];
  }, [query.data]);

  const handleLoadMore = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) {
      return;
    }

    void query.fetchNextPage();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  if (query.isPending) {
    return (
      <FeedPageShell>
        <FeedStatePanel>Loading runs…</FeedStatePanel>
      </FeedPageShell>
    );
  }

  if (query.isError) {
    return (
      <FeedPageShell>
        <FeedStatePanel tone="destructive">Failed to load runs.</FeedStatePanel>
      </FeedPageShell>
    );
  }

  if (runs.length === 0) {
    return (
      <FeedPageShell>
        <FeedStatePanel>No runs found.</FeedStatePanel>
      </FeedPageShell>
    );
  }

  return (
    <FeedPageShell>
      <RunFeed runs={runs} />

      <InfiniteScrollSentinel
        enabled={Boolean(query.hasNextPage)}
        onIntersect={handleLoadMore}
      />

      {query.isFetchingNextPage ? (
        <FeedStatePanel>Loading more runs…</FeedStatePanel>
      ) : null}
    </FeedPageShell>
  );
}
