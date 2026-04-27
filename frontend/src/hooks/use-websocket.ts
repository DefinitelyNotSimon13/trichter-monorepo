import { useEffect, useRef, useState } from "react";
import type { WsServerEvent } from "#/lib/websocket-types";

const PING_INTERVAL_MS = 25_000;
const PONG_TIMEOUT_MS = 15_000;
const RECONNECT_DELAYS_MS = [2_000, 5_000, 10_000];

function getWsUrl(): string {
  const loc = window.location;
  const protocol = loc.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${loc.host}/api/v2/ws`;
}

function parseMessage(raw: string): WsServerEvent | null {
  try {
    return JSON.parse(raw) as WsServerEvent;
  } catch {
    return null;
  }
}

type Options = { enabled?: boolean };

export type WsConnectionStatus = "connecting" | "connected" | "reconnecting";

export function useWebSocketConnection(
  onEvent: (msg: WsServerEvent) => void,
  options: Options = {},
): { status: WsConnectionStatus } {
  const { enabled = true } = options;

  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const [status, setStatus] = useState<WsConnectionStatus>("connecting");

  useEffect(() => {
    if (typeof window === "undefined" || !enabledRef.current) return;

    let ws: WebSocket | null = null;
    let pingTimer: ReturnType<typeof setTimeout> | null = null;
    let pongTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempt = 0;
    let destroyed = false;

    function clearTimers() {
      if (pingTimer) clearTimeout(pingTimer);
      if (pongTimer) clearTimeout(pongTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      pingTimer = null;
      pongTimer = null;
      reconnectTimer = null;
    }

    function schedulePing() {
      pingTimer = setTimeout(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({ type: "ping" }));
        pongTimer = setTimeout(() => {
          ws?.close();
        }, PONG_TIMEOUT_MS);
      }, PING_INTERVAL_MS);
    }

    function scheduleReconnect() {
      if (destroyed) return;
      const delay =
        RECONNECT_DELAYS_MS[
          Math.min(reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)
        ];
      reconnectAttempt++;
      setStatus("reconnecting");
      reconnectTimer = setTimeout(connect, delay);
    }

    function connect() {
      if (destroyed) return;
      ws = new WebSocket(getWsUrl());

      ws.onopen = () => {
        reconnectAttempt = 0;
        setStatus("connected");
        schedulePing();
      };

      ws.onmessage = (event) => {
        const msg = parseMessage(event.data as string);
        if (!msg) return;
        if (msg.type === "pong") {
          if (pongTimer) clearTimeout(pongTimer);
          pongTimer = null;
          schedulePing();
          return;
        }
        onEventRef.current(msg);
      };

      ws.onerror = () => {
        ws?.close();
      };

      ws.onclose = () => {
        clearTimers();
        scheduleReconnect();
      };
    }

    connect();

    return () => {
      destroyed = true;
      clearTimers();
      ws?.close();
      ws = null;
    };
  }, []);

  return { status };
}
