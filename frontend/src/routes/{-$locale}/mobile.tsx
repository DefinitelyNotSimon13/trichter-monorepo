import { BrandHeader } from "#/components/brand-header";
import { Footer } from "#/components/footer";
import { LocalizedLink } from "#/components/localized-link";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/mobile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col justify-center">
      <BrandHeader />

      <main className="flex-1 w-full h-full items-center flex justify-center flex-col">
        <h1 className="text-center text-4xl font-black text-primary">
          Account Created
        </h1>
        <p className="text-center max-w-150">
          After verifying your email, you can login in the app. If you signed up
          using google you are verified automatically.
        </p>
      </main>

      <Footer />
    </div>
  );
}
