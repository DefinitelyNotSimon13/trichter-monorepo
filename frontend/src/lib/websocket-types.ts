export type WsEventType =
  | "run.created"
  | "run.deleted"
  | "run.user-updated"
  | "run.image-uploaded";

type WsEventBase = {
  type: "event";
  version: number;
  occurredAt: string;
};

export type WsServerEvent =
  | (WsEventBase & {
      eventType: "run.created";
      payload: { runId: string; userId: string };
    })
  | (WsEventBase & { eventType: "run.deleted"; payload: { runId: string } })
  | (WsEventBase & {
      eventType: "run.user-updated";
      payload: { runId: string; userId: string | null };
    })
  | (WsEventBase & {
      eventType: "run.image-uploaded";
      payload: { runId: string; imageUrl: string };
    })
  | { type: "pong"; ts: string };
