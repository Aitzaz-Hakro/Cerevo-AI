# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Everything runs from `Frontend/` — the repo root has no `package.json`.

```bash
cd Frontend
npm install
npm run dev        # next dev
npm run build      # next build
npm run start      # next start
npx tsc --noEmit   # typecheck — REQUIRED, build does not typecheck (see Gotchas)
```

`npm run lint` is declared as `eslint .` but is broken: ESLint is not installed and no ESLint
config exists. Use `npx tsc --noEmit` instead, or install and configure ESLint first.

No test framework is configured — no runner, no test files. Adding tests means setting up a
runner from scratch.

PDF export in dev needs a local Chrome binary: set `CHROME_EXECUTABLE_PATH` or
`PUPPETEER_EXECUTABLE_PATH` in `Frontend/.env.local`.

### Environment variables

Consumed in code (`.env` / `.env.local`, both gitignored):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `CHROME_EXECUTABLE_PATH`,
`PUPPETEER_EXECUTABLE_PATH`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ATS_API_URL`,
`NEXT_PUBLIC_JOB_MATCHER_API_URL`, `NEXT_PUBLIC_RESUME_BUILDER_API_URL`,
`NEXT_PUBLIC_PORTFOLIO_API_BASE_URL`, `NEXT_PUBLIC_PORTFOLIO_BUILD_ENDPOINT`.
Every one of these has a hardcoded fallback in source, so a missing var fails silently against
a production URL rather than erroring.

## Architecture

One Next.js 15 App Router app (`Frontend/`). All AI/ML inference lives in separate FastAPI
services deployed on Railway; this repo contains only clients for them. `services/resume-analyzer/`
at the repo root is an empty leftover directory, and `/Backend` is gitignored — no backend source
is in this repo.

### Feature surfaces and their backends

Each product feature is one route under `Frontend/app/`, and each talks to a *different* service:

| Route | Talks to | Via |
|---|---|---|
| `/ats-checker` | `atsscorechecker-production-3219.up.railway.app` | `services/atsCheckerService.js` (direct, browser) |
| `/job-matcher` | `web-production-f1221.up.railway.app` | `services/jobMatcherService.js` (direct, browser) |
| `/portfolio-builder` | `web-production-57d28a.up.railway.app` | `lib/apiClient.ts` (direct, browser) |
| `/interview` | `interprep-production.up.railway.app` | `app/api/interview/*` route handlers (server proxy) |
| `/resume-builder`, `/editor/[resumeId]` | Supabase + local Puppeteer | `app/api/resume/[resumeId]`, `app/api/export-pdf` |

Interview is the only feature that proxies through Next route handlers. `lib/interview-api.ts`
holds `API_MAP`, a field-name translation layer between the app's camelCase shape and the
upstream service's snake_case (`/upload_cv`, `/answer`); the route handlers read many fallback
key names per field because the upstream response shape is not stable.

### Resume editor

The most involved subsystem. `/resume-builder` and `/editor/[resumeId]` both render
`components/editor/EditorShell.tsx`; `/resume-builder` passes a hardcoded UUID.

Data flows one way through a single Zustand + Immer store:

```
store/resume-store.ts (ResumeData)
  -> ResumeCanvas -> TemplateRenderer -> <X>Template -> renderSection() -> <Type>Section -> InlineField
                                                                                              |
                                       updateSectionData(sectionId, patch) <-------------------+
```

- `types/resume.ts` is the contract: `ResumeData.sections` is an ordered array of `ResumeSection`,
  each carrying a discriminated-union `SectionData` keyed on `type`.
- Templates are registered in three places that must stay in sync when adding one:
  `lib/templates/registry.ts` (metadata for the switcher), `TemplateRenderer.tsx` (the React
  switch), and `app/api/export-pdf/route.ts` (`buildHtmlFromResumeData` switch).
- **The PDF export re-implements every template a second time as hand-written HTML strings.**
  Editing a template component does not change the exported PDF. On-screen A4 metrics
  (`794x1123px`, `48px 54px` padding in `ResumeCanvas.tsx`) are duplicated as CSS in the export
  route, so the two drift apart easily.
- `InlineField` wraps `react-contenteditable` and passes user HTML straight through
  `dangerouslySetInnerHTML`-equivalent paths; the export route interpolates the same strings into
  HTML unescaped (`asHtml` only checks the value is a string).
- `hooks/useAutoSave.ts` debounces 1.5s and PATCHes the whole resume to
  `/api/resume/[resumeId]`, which upserts into the Supabase `resumes` table
  (`id`, `user_id`, `title`, `template_id`, `resume_data`, `updated_at`). There is no GET
  counterpart — `EditorShell` always calls `initResume()` with defaults, so **saved resumes are
  never loaded back**. The schema is not in this repo.

### Auth

Supabase Auth via `@supabase/ssr`, three clients: `utils/supabase/client.ts` (browser),
`utils/supabase/server.ts` (RSC/route handlers, async), `utils/supabase/middleware.ts`
(session refresh). Root `middleware.ts` runs `updateSession` on nearly every request.
Server actions in `lib/auth-actions.ts` (`login`, `signup`, `signout`, `signInWithGoogle`);
email confirmation lands on `app/(auth)/auth/confirm/route.ts`.

Auth is **refresh-only** — `middleware.ts` never redirects. Every feature route is publicly
reachable; the only authorization check anywhere is inside `app/api/resume/[resumeId]/route.ts`.
`next-auth` is in `package.json` and `auth.ts` exists but is 0 bytes; there is no NextAuth code.
`lib/users.ts` is an unused in-memory user array from an earlier iteration.

### Styling

Tailwind v4 via `@tailwindcss/postcss`, configured CSS-first through `@theme inline` in
`app/globals.css`. shadcn/ui ("new-york", ~60 components in `components/ui/`) with `@/*` path
alias mapping to `Frontend/`.

## Gotchas

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `npm run build` succeeds with
  broken types. `npx tsc --noEmit` currently reports 4 real errors (interview components, the
  `/api/interview/end` handler calling `endSession(sessionId)` on a zero-arg function, and
  `editor/[resumeId]/page.tsx` typing `params` as a plain object — in Next 15 it is a Promise and
  should be awaited; it still works via a deprecation shim that will be removed).
- `tailwind.config.js` exists but is **dead** — Tailwind v4 ignores it without an `@config`
  directive, and `components.json` sets `tailwind.config: ""`. The `animate-star-bottom` /
  `animate-star-top` classes it defines are used by `components/StarBorder.tsx` and are absent
  from the built CSS.
- `styles/globals.css` is a stale duplicate; only `app/globals.css` is imported.
- `services/resumeService.js` calls `axios` without importing it — it would throw at runtime, but
  nothing imports it. `services/jobService.js` and `services/skillGapService.js` are likewise
  unimported and hardcode `localhost:8000`.
- `hooks/use-toast.ts` and `hooks/use-mobile.ts` are byte-identical duplicates of
  `components/ui/use-toast.ts` and `components/ui/use-mobile.tsx`. Neither toast system
  (`sonner` or the Radix `Toaster`) is mounted anywhere, so `toast()` calls will silently no-op.
- `components/interview/` holds two generations of the same feature. Live: `InterviewShell` ->
  `ChatWindow` / `InputBar` / `InterviewSidebar` / `MessageBubble`, using local `useState` and
  `components/interview/types.ts`. Dead: `ChatInterface`, `InterviewHeader`, `ResultsSummary`,
  `ResumeUploadStep`, which use `store/interview-store.ts` and `types/interview.ts` — that whole
  store is orphaned. `/api/interview/end` is also unreachable from the client.
- React 18.3 runtime with `@types/react` 19 installed — a known source of spurious type errors.
- Backend service URLs are hardcoded as fallbacks throughout `services/*.js`, `lib/apiClient.ts`,
  and `lib/interview-api.ts`. `atsCheckerService.js` brute-forces 3 endpoints x 3 field names (up
  to 9 uploads of the same file) because the ATS API contract is unknown.
- `components/DashboardNav.tsx` is unused. `zod`, `react-hook-form`, `recharts`, and `next-auth`
  are installed but unused outside `components/ui/`. `Frontend/temp-resume.txt`,
  `Frontend/draw.tldr`, and a stub `pnpm-lock.yaml` (alongside the real `package-lock.json`) are
  committed.
