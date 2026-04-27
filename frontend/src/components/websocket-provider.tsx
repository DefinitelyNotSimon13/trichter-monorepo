import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { useWebSocketConnection } from "#/hooks/use-websocket";
import type { WsEventType, WsServerEvent } from "#/lib/websocket-types";

type Listener = (payload: unknown) => void;

type WebSocketContextValue = {
  subscribe: (type: WsEventType, cb: Listener) => () => void;
};

const WebSocketContext = createContext<WebSocketContextValue | undefined>(
  undefined,
);

export function useWebSocketContext() {
  const ctx = useContext(WebSocketContext);
  if (!ctx)
    throw new Error(
      "useWebSocketContext must be used within WebSocketProvider",
    );
  return ctx;
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const subs = useRef(new Map<WsEventType, Set<Listener>>());

  const handleEvent = useCallback((msg: WsServerEvent) => {
    if (msg.type !== "event") return;
    const listeners = subs.current.get(msg.eventType);
    if (!listeners) return;
    for (const cb of listeners) {
      cb(msg.payload);
    }
  }, []);

  useWebSocketConnection(handleEvent);

  const subscribe = useCallback((type: WsEventType, cb: Listener) => {
    if (!subs.current.has(type)) {
      subs.current.set(type, new Set());
    }
    subs.current.get(type)?.add(cb);
    return () => {
      subs.current.get(type)?.delete(cb);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}
