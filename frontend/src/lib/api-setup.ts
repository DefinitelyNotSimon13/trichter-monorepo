import { client } from "#/client/client.gen";
import { authClient } from "#/lib/auth-client";

async function getBearerToken(): Promise<string | null> {
  const { data, error } = await authClient.token();
  if (error) {
    console.error("[api-setup] failed to fetch bearer token:", error);
    return null;
  }
  return data?.token ?? null;
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

  client.interceptors.response.use((response) => {
    if (response.status === 401) {
      window.location.href = "/login";
    }
    return response;
  });
}
