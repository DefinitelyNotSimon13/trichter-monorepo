import { useStore } from "@tanstack/react-form";

import { useFormContext } from "#/hooks/form-context";
import { Button } from "#/components/ui/button";
import { Spinner } from "../ui/spinner";

export function FormSubmitButton({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) {
  const form = useFormContext();
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <Button
      type="submit"
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
