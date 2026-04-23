import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/new-mobile")({
  head: () => ({
    meta: [
      { title: "Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
      <h1 className="text-center text-4xl font-black text-primary">
        Account Created
      </h1>
      <a
        href="trichter://oauth/callback"
        className="py-5 text-xl bold underline"
      >
        Return to the app
      </a>
      <p className="text-center max-w-150">
        If you see this you may need to restart the app and login again!
      </p>
    </main>
  );
}
