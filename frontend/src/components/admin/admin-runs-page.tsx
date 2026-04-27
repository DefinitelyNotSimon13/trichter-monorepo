import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteRunMutation,
  getRunsOptions,
  getRunsQueryKey,
  updateRunUserMutation,
} from "#/client/@tanstack/react-query.gen";
import type { RunDto } from "#/client/types.gen";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { useWsEvent } from "#/hooks/use-ws-event";
import { AssignUserDialog } from "./runs/assign-user-dialog";
import { CreateRunDialog } from "./runs/create-run-dialog";
import { RunsTable } from "./runs/runs-table";

export function AdminRunsPage() {
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [runToDelete, setRunToDelete] = useState<RunDto | null>(null);
  const [runToAssign, setRunToAssign] = useState<RunDto | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const sort = sorting[0];
  const sortField = sort?.id ?? "createdAt";
  const sortDir = sort?.desc ? "desc" : "asc";

  const runsQuery = useQuery({
    ...getRunsOptions({
      query: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: [`${sortField},${sortDir}`],
      },
    }),
    placeholderData: keepPreviousData,
  });

  const invalidateRuns = () =>
    void queryClient.invalidateQueries({ queryKey: getRunsQueryKey() });

  useWsEvent("run.created", invalidateRuns);
  useWsEvent("run.deleted", invalidateRuns);
  useWsEvent("run.user-updated", invalidateRuns);

  const deleteMut = useMutation({
    ...deleteRunMutation(),
    onSuccess: () => {
      toast.success("Run deleted");
      setRunToDelete(null);
      invalidateRuns();
    },
    onError: () => toast.error("Failed to delete run"),
  });

  const assignMut = useMutation({
    ...updateRunUserMutation(),
    onSuccess: () => {
      toast.success("Run reassigned");
      setRunToAssign(null);
      invalidateRuns();
    },
    onError: () => toast.error("Failed to assign user"),
  });

  const rows = runsQuery.data?.content ?? [];
  const total = runsQuery.data?.page?.totalElements ?? 0;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Runs</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Browse and manage all runs. The table updates in real time via
            WebSocket.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus className="mr-2 size-4" />
          Create run
        </Button>
      </header>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>All runs</CardTitle>
        </CardHeader>
        <CardContent>
          <RunsTable
            rows={rows}
            total={total}
            isLoading={runsQuery.isLoading}
            isError={runsQuery.isError}
            sorting={sorting}
            pagination={pagination}
            onSortingChange={setSorting}
            onPaginationChange={setPagination}
            actions={{ onDelete: setRunToDelete, onAssign: setRunToAssign }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={!!runToDelete}
        onOpenChange={(open) => !open && setRunToDelete(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete run</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete run{" "}
              <span className="font-medium text-foreground">
                {runToDelete?.id?.slice(0, 8)}…
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRunToDelete(null)}
              disabled={deleteMut.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMut.isPending}
              onClick={() =>
                runToDelete?.id &&
                deleteMut.mutate({ path: { id: runToDelete.id } })
              }
            >
              {deleteMut.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AssignUserDialog
        run={runToAssign}
        onClose={() => setRunToAssign(null)}
        onAssign={(runId, userId) =>
          assignMut.mutate({ path: { id: runId }, body: { userId } })
        }
        isPending={assignMut.isPending}
      />

      <CreateRunDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </section>
  );
}
