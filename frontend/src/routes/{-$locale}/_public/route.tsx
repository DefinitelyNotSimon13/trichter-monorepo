import { Outlet, createFileRoute } from "@tanstack/react-router";
import { BrandHeader } from "#/components/brand-header";
import { Footer } from "#/components/footer";

export const Route = createFileRoute("/{-$locale}/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <BrandHeader />
      <Outlet />
      <Footer />
    </div>
  );
}
