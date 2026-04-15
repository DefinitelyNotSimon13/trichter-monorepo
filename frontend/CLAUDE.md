# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo. The primary working directory is `frontend/`, a TanStack Start (SSR React) application. The `backend/` is a separate Spring Boot (JVM/Gradle) service.

## Commands

All commands should be run from the `frontend/` directory.

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Production build
npm run test       # Run vitest tests
npm run check      # Lint + format check (Biome)
npm run lint       # Lint only
npm run format     # Format only
```

Add shadcn components:
```bash
pnpm dlx shadcn@latest add <component>
```

Database scripts (run from monorepo root via `just`):
```bash
just db-local <file.sql>   # Run SQL against local DB
just db-dev <file.sql>     # Run SQL against dev DB
```

## Architecture

### Framework & Routing

TanStack Start (SSR) with file-based routing in `src/routes/`. Route files map directly to URL paths. The `{-$locale}` path segment is a dynamic optional prefix for internationalization — routes like `src/routes/{-$locale}/app/feed.tsx` handle both `/feed` and `/en/feed`.

Route layout hierarchy:
- `__root.tsx` — HTML shell, providers (QueryClient, i18n, TooltipProvider)
- `{-$locale}/route.tsx` — locale detection/persistence layout
- `{-$locale}/app.tsx` — authenticated app shell with sidebar + mobile nav
- `{-$locale}/_auth/*` — unauthenticated auth pages (login, signup, forgot/reset password)

### Data Fetching

Backend API calls use a generated TanStack Query client at `src/client/` (auto-generated from `openapi/backend.json` by `@hey-api/openapi-ts` via the Vite plugin). Import query options from `#/client/@tanstack/react-query.gen` and types from `#/client/types.gen`.

Dev server proxies `/api/runs` and `/actuator` to the Spring Boot backend at `http://localhost:8080`.

### Authentication

Better Auth (`src/lib/auth.ts`) runs server-side with a PostgreSQL connection. Features enabled: email/password, Google OAuth, passkeys, username, captcha (Cloudflare Turnstile), JWT, admin panel, API keys.

Client-side auth uses `authClient` from `src/lib/auth-client.ts`. Server functions that need auth call `getSession()` or `requireAdminSession()` from `src/lib/auth.functions.ts`.

### Internationalization

Supported locales: `en` (default), `de`. Translation files live in `src/lib/i18n/locales/{locale}/{namespace}.json` with namespaces `common`, `landing`, `app`. The locale is resolved from (in order): URL param → localStorage → browser language.

Components that need the locale accept a `locale: string` prop (type `LocaleProps` from `src/lib/utils.ts`). Pass the locale when building links: `<Link to="/{-$locale}" params={{ locale }}>`.

### Environment Variables

Defined with T3Env and Zod validation:
- `src/env/client.ts` — client-side (`VITE_` prefix): `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_TURNSTYLE_SITE_KEY`
- `src/env/server.ts` — server-side: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `TURNSTYLE_SECRET_KEY`, `GOOGLE_CLIENT_SECRET`, `ACS_CONNECTION_STRING`

Import as `import { clientEnv } from "#/env/client"` or `import { serverEnv } from "#/env/server"`.

### Path Aliases

`#/*` maps to `src/*` (configured in `package.json` imports and tsconfig). Always prefer `#/` over relative paths.

### Styling

Tailwind CSS v4 via Vite plugin. `cn()` utility (clsx + tailwind-merge) from `#/lib/utils`. shadcn/ui components in `src/components/ui/`. Formatting uses tabs, double quotes (Biome config).

### Key Libraries

- `@tanstack/react-form` — forms with `FormFieldError`, `FormTextInput`, `FormPasswordInput`, `FormSubmitButton` wrappers in `src/components/form/`
- `sonner` — toast notifications
- `lucide-react` — icons
- `next-themes` — theme management (light/dark/auto, persisted to localStorage)
- React Compiler (`babel-plugin-react-compiler`) is enabled

### Generated Files

`src/routeTree.gen.ts` and `src/client/` are auto-generated — do not edit manually. `src/routeTree.gen.ts` is excluded from Biome linting.
