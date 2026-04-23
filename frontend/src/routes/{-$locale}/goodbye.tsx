import { BrandHeader } from "#/components/brand-header";
import { Footer } from "#/components/footer";
import { LocalizedLink } from "#/components/localized-link";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/goodbye")({
  head: () => ({
    meta: [
      { title: "Goodbye | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col justify-center">
      <BrandHeader />

      <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
        <h1 className="text-center text-4xl font-black text-highlight">
          Account deleted
        </h1>
        <LocalizedLink className="underline">Homepage</LocalizedLink>
      </main>

      <Footer />
    </div>
  );
}
