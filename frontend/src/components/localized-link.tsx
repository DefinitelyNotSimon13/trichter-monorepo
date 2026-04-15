import type { ComponentProps } from "react";
import { Link } from "@tanstack/react-router";

type LinkTo = ComponentProps<typeof Link>["to"];

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "to"> & {
  to?: LinkTo;
};

function normalizeLocalizedTo(to?: LinkTo): LinkTo {
  if (!to) {
    return "/{-$locale}";
  }

  if (typeof to !== "string") {
    return to;
  }

  if (
    to.startsWith("/{-$locale}") ||
    to.startsWith("http://") ||
    to.startsWith("https://") ||
    to.startsWith("#") ||
    to.startsWith("?")
  ) {
    return to;
  }

  if (to === "/") {
    return "/{-$locale}";
  }

  if (to.startsWith("/")) {
    return `/{-$locale}${to}`;
  }

  return to;
}

export function LocalizedLink({ to, ...props }: LocalizedLinkProps) {
  return <Link {...props} to={normalizeLocalizedTo(to)} />;
}
