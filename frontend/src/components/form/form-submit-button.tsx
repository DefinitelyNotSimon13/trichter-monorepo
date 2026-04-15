import { useStore } from "@tanstack/react-form";

import { useFormContext } from "#/hooks/form-context";
import { Button } from "#/components/ui/button";

export function FormSubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <Button type="submit" disabled={isSubmitting} className="w-full">
      {isSubmitting ? "Please wait..." : label}
    </Button>
  );
}
