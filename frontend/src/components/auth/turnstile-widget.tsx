import { ClientOnly, useHydrated } from "@tanstack/react-router";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { clientEnv } from "#/env/client";

type TurnstileWidgetProps = {
  className?: string;
  ref: React.Ref<TurnstileInstance>;
};

export function TurnstileWidget({ className, ref }: TurnstileWidgetProps) {
  return (
    <ClientOnly fallback={<TurnstileFallback className={className} />}>
      <div className={className}>
        <Turnstile ref={ref} siteKey={clientEnv.VITE_TURNSTYLE_SITE_KEY} />
      </div>
    </ClientOnly>
  );
}

function TurnstileFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="h-16.25 w-75 rounded-md border bg-muted/20" />
    </div>
  );
}
