import { useState } from "react";
import type { RunDto, UserDto } from "#/client/types.gen";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Label } from "#/components/ui/label";
import { UserSearchInput } from "./user-search-input";

type Props = {
  run: RunDto | null;
  onClose: () => void;
  onAssign: (runId: string, userId: string) => void;
  isPending?: boolean;
};

export function AssignUserDialog({ run, onClose, onAssign, isPending }: Props) {
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const handleClose = () => {
    setSelectedUser(null);
    onClose();
  };

  const handleAssign = () => {
    if (!run?.id || !selectedUser?.id) return;
    onAssign(run.id, selectedUser.id);
  };

  return (
    <Dialog open={!!run} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Assign user to run</DialogTitle>
          <DialogDescription>
            Search for a user to assign to run{" "}
            <span className="font-medium text-foreground">
              {run?.id?.slice(0, 8)}…
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>User</Label>
          <UserSearchInput
            selectedUser={selectedUser}
            onSelect={setSelectedUser}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedUser || isPending}>
            {isPending ? "Assigning…" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
