import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/mobile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
      <h1 className="text-center text-4xl font-black text-primary">
        Successfully logged in!
      </h1>
      <a
        href="trichter://oauth/callback"
        className="py-5 text-xl bold underline"
      >
        Return to the app
      </a>
      <p className="text-center max-w-100 italic">
        If you see this page, you may need to restart the App and click on
        "Sign In" again.
      </p>
    </main>
  );
}
