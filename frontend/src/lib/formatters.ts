export function formatTimestamp(value?: string) {
  if (!value) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDuration(value?: number) {
  if (typeof value !== "number") {
    return "—";
  }

  return `${value.toFixed(3)}s`;
}

export function formatVolume(value?: number) {
  if (typeof value !== "number") {
    return "—";
  }

  return `${value.toFixed(2)}L`;
}

export function formatRate(value?: number) {
  if (typeof value !== "number") {
    return "—";
  }

  return `${value.toFixed(2)}L/min`;
}

export function formatDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
