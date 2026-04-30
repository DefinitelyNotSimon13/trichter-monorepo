# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Dev server on port 3000
bun run build     # Production build
bun run test      # Vitest (run once)
bun run lint      # Biome lint
bun run format    # Biome format
bun run check     # Biome lint + format check

# Run a single test file
bun run test src/path/to/file.test.ts

# Add a Shadcn component
pnpm dlx shadcn@latest add <component>
```

The dev server proxies `/api/v2` and `/actuator` to `http://localhost:8080` (the backend).

## Path Alias

`#/*` maps to `src/*` (configured in `package.json` imports). Use `#/components/...`, `#/lib/...` etc. throughout. (`@/*` also resolves to `src/*` via tsconfig but `#/*` is preferred.)

## Architecture

### Framework & Runtime
TanStack Start (SSR React) with a Nitro/Bun server. File-based routing via TanStack Router. `src/router.tsx` wires up the `QueryClient` context.

### Locale Routing
All application routes live under `src/routes/{-$locale}/`. The `{-$locale}` segment is an **optional** route param — URLs work with or without a locale prefix (e.g., `/en/app/feed` or `/app/feed`).

- Use the bare TanStack `Link` with `to="/{-$locale}/..."` for internal navigation. TanStack Router inherits the `locale` param from the active route context automatically in JSX.
- In `beforeLoad` redirects, always pass `params: { locale: params.locale }` explicitly to preserve the locale across server-side redirects.
- Locale detection order: URL param → `localStorage` → browser `navigator.languages` → default (`en`).
- Supported locales: `en`, `de` — defined in `src/lib/i18n/config.ts`.

### i18n
react-i18next with three namespaces: `common`, `landing`, `app`. Translation files are in `src/lib/i18n/locales/{en,de}/`. The i18n instance is initialized in `__root.tsx` via `initI18n(locale)` and provided via `<I18nextProvider>`.

### Auth (Better Auth)
- **Server config**: `src/lib/auth.ts` — PostgreSQL-backed, email/password + Google OAuth, plugins: passkey, admin, apiKey, jwt, captcha (Cloudflare Turnstile), username, i18n.
- **Client**: `src/lib/auth-client.ts` — `authClient` from `better-auth/react`. Use `authClient.useSession()` in components.
- **Server functions**: `src/lib/auth.functions.ts` — `getSession()` and `requireAdminSession()` use `createServerFn` from TanStack Start.

### Generated API Client
`src/client/` is **entirely auto-generated** from `openapi/backend.json` via `@hey-api/openapi-ts`. Do not edit these files manually — they are regenerated on build via the Vite plugin. Import query options from `#/client/@tanstack/react-query.gen` and types from `#/client/types.gen`.

### Environment Variables
Split into two validated T3Env modules:
- `src/env/client.ts` — VITE_-prefixed vars (safe for browser)
- `src/env/server.ts` — server-only secrets (DATABASE_URL, auth keys, email config)

Import from `#/env/client` or `#/env/server` respectively. Never import server env on the client.

### UI Components
Shadcn UI (`src/components/ui/`) over Radix UI, styled with Tailwind CSS v4. `cn()` utility is in `src/lib/utils.ts`.

### Theme
Managed with an inline `<script>` in `__root.tsx` that reads `localStorage.theme` before first paint to avoid FOUC. Three modes: `light`, `dark`, `auto` (follows OS).

### Forms
TanStack React Form via a custom `useAppForm()` hook (`#/hooks/form.ts`). It pre-registers field components (`FormTextInput`, `FormPasswordInput`, `FormOTPInput`) and form-level components (`FormSubmitButton`). Use `form.AppField` / `form.Subscribe` rather than raw TanStack Form APIs.

### Server Functions
`createServerFn()` from TanStack Start defines typed server-client boundaries without a dedicated API route. Existing server functions live in `#/lib/auth.functions.ts` (`getSession`, `requireAdminSession`). Prefer this pattern over new API routes for data access from route loaders.

### Route Guards
Auth protection is enforced in `beforeLoad()` hooks on route files. The `{-$locale}/app.tsx` layout requires a valid session; admin routes additionally call `requireAdminSession()` and redirect on failure.

### TypeScript & Linting
`noUnusedLocals` and `noUnusedParameters` are enabled — the build will fail on unused variables. Biome enforces double quotes and auto import organization on save.
