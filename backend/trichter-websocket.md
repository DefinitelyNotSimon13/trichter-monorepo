# WebSocket Protocol (Trichter)

This document describes the custom JSON-based WebSocket protocol used for realtime communication between the backend and
clients.

---

## Connection

Endpoint: `ws(s)://<host>/ws`
Authentication:

- Same mechanism as REST API (e.g. Bearer token or session cookie)
- User identity is derived from the authenticated session

---

## Event Message Format

All messages are JSON objects.

### Server -> Client

```json
{
  "type": "event",
  "eventType": "run.created",
  "version": 1,
  "occurredAt": "2026-04-17T12:00:00Z",
  "payload": {}
}
```

#### Fields

| Field      | Type     | Description                       |
|------------|----------|-----------------------------------|
| type	      | string   | 	Always "event"                   |
| eventType	 | string	  | Domain event name                 |
| version	   | number	  | Event version (for compatibility) |
| occurredAt | 	string	 | ISO-8601 timestamp                |
| payload    | 	object	 | Event-specific data               |

#### Example Events

##### Run Created

```json
{
  "type": "event",
  "eventType": "run.created",
  "version": 1,
  "occurredAt": "2026-04-17T12:00:00Z",
  "payload": {
    "runId": "uuid",
    "userId": "uuid"
  }
}
```

##### Image Uploaded

```json
{
  "type": "event",
  "eventType": "run.image-uploaded",
  "version": 1,
  "occurredAt": "2026-04-17T12:00:00Z",
  "payload": {
    "runId": "uuid",
    "imageUrl": "https://..."
  }
}
```

## Heartbeat

### Client → Server

#### Ping (Heartbeat)

```json
{
  "type": "ping"
}
```

### Server → Client

#### Pong (Heartbeat Response)

```json
{
  "type": "pong",
  "ts": "2026-04-17T12:00:00Z"
}
```

## Connection Health

- Clients SHOULD send a ping every ~25 seconds
- Server responds with pong
- If no pong is received within a timeout (~10–15 seconds), client SHOULD reconnect
- Server may close stale connections
-

## Reconnection Strategy

Clients SHOULD:

- Automatically reconnect on disconnect
- Use exponential backoff (e.g. 2s → 5s → 10s)
- Resubscribe / restore state after reconnect

## Versioning

- version allows backward-compatible changes
- New fields MAY be added to payloads
- Clients SHOULD ignore unknown fields
