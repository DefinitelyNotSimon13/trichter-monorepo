import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  createRunMutation,
  getRunsQueryKey,
} from "#/client/@tanstack/react-query.gen";
import type { UserDto } from "#/client/types.gen";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { UserSearchInput } from "./user-search-input";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CreateRunDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [rate, setRate] = useState("");
  const [volume, setVolume] = useState("");
  const [duration, setDuration] = useState("");

  const mutation = useMutation({
    ...createRunMutation(),
    onSuccess: () => {
      toast.success("Run created");
      void queryClient.invalidateQueries({ queryKey: getRunsQueryKey() });
      handleClose();
    },
    onError: () => toast.error("Failed to create run"),
  });

  const handleClose = () => {
    setSelectedUser(null);
    setRate("");
    setVolume("");
    setDuration("");
    onClose();
  };

  const handleCreate = () => {
    mutation.mutate({
      body: {
        userId: selectedUser?.id,
        rate: rate ? Number(rate) : undefined,
        volume: volume ? Number(volume) : undefined,
        duration: duration ? Number(duration) : undefined,
      },
    });
  };

  const canSubmit =
    !mutation.isPending && (rate !== "" || volume !== "" || duration !== "");

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create fake run</DialogTitle>
          <DialogDescription>
            Manually create a run entry for testing or admin purposes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>User (optional)</Label>
            <UserSearchInput
              selectedUser={selectedUser}
              onSelect={setSelectedUser}
              placeholder="Search users…"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="run-rate">Rate</Label>
              <Input
                id="run-rate"
                type="number"
                min="0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 5.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="run-volume">Volume</Label>
              <Input
                id="run-volume"
                type="number"
                min="0"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g. 1.4"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="run-duration">Duration (s)</Label>
              <Input
                id="run-duration"
                type="number"
                min="0"
                step="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 60"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!canSubmit}>
            {mutation.isPending ? "Creating…" : "Create run"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
