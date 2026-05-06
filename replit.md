# UX/UI Designer Portfolio

A personal portfolio website for a UX/UI designer, showcasing featured work, services, and a hero introduction.

## Run & Operate

- **Dev**: `npm run dev` — starts Express + Vite dev server on port 5000
- **Build**: `npm run build` — builds client (Vite) + server (esbuild) into `dist/`
- **Start (prod)**: `npm start` — runs `dist/index.cjs`
- **Typecheck**: `npm run check`
- **DB push**: `npm run db:push`
- **Required env vars**: `DATABASE_URL` (PostgreSQL connection string)

## Stack

- **Frontend**: React 18, Vite 7, Tailwind CSS 3, Framer Motion, Radix UI / Shadcn, TanStack Query, Wouter
- **Backend**: Node 20, Express 5, Passport.js (local), Drizzle ORM, Zod
- **DB**: PostgreSQL via `pg` + Drizzle ORM
- **Build**: esbuild (server bundle), Vite (client bundle), tsx (dev runtime)

## Where things live

- `client/src/pages/UxUiDesigner.tsx` — main portfolio landing page
- `client/src/pages/sections/` — Hero, FeaturedWork, WhyWorkWithMe, Footer sections
- `client/src/components/ui/` — Shadcn/Radix UI component library
- `server/index.ts` — Express server entry
- `server/routes.ts` — API route definitions
- `server/storage.ts` — data layer (in-memory `MemStorage`)
- `shared/schema.ts` — Drizzle schema + Zod types (source of truth for DB shape)
- `drizzle.config.ts` — Drizzle config

## Architecture decisions

- Single Express server serves both the API (`/api/*`) and the Vite-built client (SPA catch-all)
- Server bundles key deps (see `script/build.ts` allowlist) to reduce cold-start syscalls
- Shared `schema.ts` is imported by both frontend and backend for type safety across the stack
- Session store uses `connect-pg-simple` in production, `memorystore` fallback in dev

## Product

- Dark-themed portfolio landing page with animated hero section
- Featured work showcase section
- "Why Work With Me" value proposition section
- Footer with contact/social links

## User preferences

_Populate as you build_

## Gotchas

- Port is always 5000 in dev (hardcoded fallback); Replit's `PORT` env var is respected in production
- Tailwind config uses `module.exports` (CJS) but the project is ESM — Replit cartographer warns about this; it does not affect runtime
- Run `npm run db:push` after any schema changes in `shared/schema.ts`

## Pointers

- Shadcn UI docs: https://ui.shadcn.com
- Drizzle ORM docs: https://orm.drizzle.team
- Framer Motion docs: https://www.framer.com/motion
