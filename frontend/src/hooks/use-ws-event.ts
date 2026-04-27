import { useEffect, useRef } from "react";
import { useWebSocketContext } from "#/components/websocket-provider";
import type { WsEventType } from "#/lib/websocket-types";

export function useWsEvent<T>(
  eventType: WsEventType,
  callback: (payload: T) => void,
): void {
  const { subscribe } = useWebSocketContext();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return subscribe(eventType, (payload) => callbackRef.current(payload as T));
  }, [eventType, subscribe]);
}
