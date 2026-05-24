// src/integrations/tanstack-devtools/root-devtools.tsx
import { lazy, Suspense } from "react";

const DevtoolsImpl = import.meta.env.DEV
  ? lazy(() => import("./root-devtools.impl"))
  : null;

export function RootDevtools() {
  if (!DevtoolsImpl) return null;

  return (
    <Suspense fallback={null}>
      <DevtoolsImpl />
    </Suspense>
  );
}
