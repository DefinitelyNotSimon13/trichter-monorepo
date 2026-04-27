import type { ReactNode } from "react";
import type { RunDto } from "#/client/types.gen";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "#/components/ui/context-menu";

export type RunActions = {
  onDelete: (run: RunDto) => void;
  onAssign: (run: RunDto) => void;
};

type Props = {
  run: RunDto;
  actions: RunActions;
  children: ReactNode;
};

export function RunRowContextMenu({ run, actions, children }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem onClick={() => actions.onAssign(run)}>
          Assign user
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => actions.onDelete(run)}
        >
          Delete run
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
