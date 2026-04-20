import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/goodbye")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
      <h1 className="text-center text-4xl font-black text-highlight">
        Account deleted
      </h1>
      <Link to="/{-$locale}" className="underline">Homepage</Link>
    </main>
  );
}
