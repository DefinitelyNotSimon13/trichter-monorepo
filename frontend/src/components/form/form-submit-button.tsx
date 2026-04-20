import { useStore } from "@tanstack/react-form";
import type React from "react";

import { useFormContext } from "#/hooks/form-context";
import { Button } from "#/components/ui/button";
import { Spinner } from "../ui/spinner";

export function FormSubmitButton({
  label,
  disabled,
  variant,
}: {
  label: string;
  disabled?: boolean;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const form = useFormContext();
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <Button
      type="submit"
      variant={variant}
      disabled={isSubmitting || disabled}
      className="w-full"
    >
      {isSubmitting ? (
        <div className="flex gap-2">
          <Spinner />
          <span className="line-clamp-1">Submitting...</span>
        </div>
      ) : (
        label
      )}
    </Button>
  );
}
