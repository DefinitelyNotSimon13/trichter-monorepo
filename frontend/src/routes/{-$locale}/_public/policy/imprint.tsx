import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/policy/imprint")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
      <h1 className="text-center text-4xl font-black text-highlight">
        Imprint
      </h1>
    </main>
  );
}
