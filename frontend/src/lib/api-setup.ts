import { client } from "#/client/client.gen";

async function getBearerToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/token", { credentials: "include" });
    if (!res.ok) return null;
    const json = (await res.json()) as { token?: string };
    return json.token ?? null;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  client.setConfig({ baseUrl: "" });

  client.interceptors.request.use(async (request) => {
    if (request.method !== "GET") {
      const token = await getBearerToken();
      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return request;
  });
}
