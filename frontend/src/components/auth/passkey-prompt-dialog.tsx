import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { authClient } from "#/lib/auth-client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PasskeyPromptDialog({ open, onOpenChange }: Props) {
  const [isPending, setIsPending] = useState(false);
  const { t } = useTranslation("app");

  const handleDismiss = () => {
    localStorage.setItem("passkey-prompt-dismissed", "1");
    onOpenChange(false);
  };

  const handleAddPasskey = async () => {
    setIsPending(true);
    const result = await authClient.passkey.addPasskey();
    setIsPending(false);
    if (result?.error) {
      toast.error(t("auth.passkey.failed"), {
        description: result.error.message,
      });
      return;
    }
    toast(t("auth.passkey.added"));
    localStorage.setItem("passkey-prompt-dismissed", "1");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/15">
              <KeyRound className="size-5 text-primary" />
            </div>
            <DialogTitle>{t("auth.passkey.title")}</DialogTitle>
          </div>
          <DialogDescription>{t("auth.passkey.description")}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            onClick={() => void handleAddPasskey()}
            disabled={isPending}
            className="w-full"
          >
            <KeyRound className="size-4" />
            {t("auth.passkey.addButton")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleDismiss}
            disabled={isPending}
            className="w-full text-muted-foreground"
          >
            {t("auth.passkey.maybeLater")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
