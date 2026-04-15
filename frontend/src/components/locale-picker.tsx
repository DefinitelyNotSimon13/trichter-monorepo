import { persistLocale } from "#/lib/i18n/locale";
import { useNavigate, useParams } from "@tanstack/react-router";

export function LocalePicker() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  const currentLocale =
    typeof params.locale === "string" ? params.locale : undefined;

  const toggle = async () => {
    const nextLocale = currentLocale === "de" ? "en" : "de";

    persistLocale(nextLocale);

    await navigate({
      to: ".",
      params: (prev) => ({
        ...prev,
        locale: nextLocale,
      }),
      replace: true,
    });
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          void toggle();
        }
      }}
      className="flex cursor-pointer items-center rounded-full border border-border bg-background p-1"
      aria-label={`Current language: ${currentLocale ?? "en"}. Click to toggle language.`}
      title="Toggle language"
    >
      <div
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
          (currentLocale ?? "en") === "en"
            ? "bg-muted text-foreground"
            : "text-muted-foreground"
        }`}
      >
        EN
      </div>
      <div
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
          currentLocale === "de"
            ? "bg-muted text-foreground"
            : "text-muted-foreground"
        }`}
      >
        DE
      </div>
    </button>
  );
}
