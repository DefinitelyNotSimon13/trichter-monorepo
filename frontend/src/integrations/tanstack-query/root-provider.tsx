import {
  environmentManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { client } from "#/client/client.gen";
import type { ReactNode } from "react";
import { clientEnv } from "#/env/client";

function makeQueryClient() {
  return new QueryClient();
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function getContext() {
  const queryClient = getQueryClient();

  client.setConfig({
    baseUrl: clientEnv.VITE_API_BASE_URL,
  });

  return {
    queryClient,
  };
}

export default function TanstackQueryProvider(props: {
  queryClient: QueryClient;
  children: ReactNode;
}) {
  client.setConfig({
    baseUrl: clientEnv.VITE_API_BASE_URL,
  });

  return (
    <QueryClientProvider client={props.queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
