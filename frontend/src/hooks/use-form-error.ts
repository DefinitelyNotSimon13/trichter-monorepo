import { useState } from "react";

/**
 * Minimal hook to manage form-level error and success message state.
 */
export function useFormError() {
  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);
  return { error, setError, clearError };
}

export function useFormMessages(initialError?: string | null) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [success, setSuccess] = useState<string | null>(null);

  const clear = () => {
    setError(null);
    setSuccess(null);
  };

  return { error, setError, success, setSuccess, clear };
}
