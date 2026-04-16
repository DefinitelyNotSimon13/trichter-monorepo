import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/.well-known/assetlinks.json")({
  server: {
    handlers: {
      GET: () => {
        return Response.json([
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: {
              namespace: "android_app",
              package_name: "org.trichter.app",
              sha256_cert_fingerprints: [
                "21:A1:8D:AD:4B:E2:CB:71:09:CE:46:DE:C9:CC:CB:76:38:23:AD:26:8D:DE:B7:C1:E6:A6:A1:AF:2F:01:F1:A4",
              ],
            },
          },
        ]);
      },
    },
  },
});
