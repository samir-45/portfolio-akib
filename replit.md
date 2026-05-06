# UX/UI Designer Portfolio

A full portfolio website for a UX/UI designer with 6 public pages plus a full admin dashboard for content management.

## Run & Operate

- **Dev**: `npm run dev` — starts Express + Vite dev server on port 5000
- **Build**: `npm run build` — builds client (Vite) + server (esbuild) into `dist/`
- **Start (prod)**: `npm start` — runs `dist/index.cjs`
- **Typecheck**: `npm run check`
- **DB push**: `npm run db:push` (run after any schema changes)
- **Required env vars**: `DATABASE_URL` (PostgreSQL connection string)
- **Admin credentials**: username `admin`, password `admin123` (seeded on first run)

## Stack

- **Frontend**: React 18, Vite 7, Tailwind CSS 3, Framer Motion, Radix UI / Shadcn, TanStack Query, Wouter
- **Backend**: Node 20, Express 5, Drizzle ORM, Zod, multer (file uploads)
- **DB**: PostgreSQL via `pg` + Drizzle ORM
- **Auth**: Session-based admin auth (crypto/scrypt hashing, express-session)
- **Build**: esbuild (server bundle), Vite (client bundle), tsx (dev runtime)

## Where things live

- `client/src/pages/Home.tsx` — Landing page (dark hero + featured work + why work with me)
- `client/src/pages/Work.tsx` — All projects listing
- `client/src/pages/About.tsx` — Bio, skills, tools, beyond design
- `client/src/pages/Process.tsx` — Design process steps (alternating layout)
- `client/src/pages/Playground.tsx` — Filterable experiments grid
- `client/src/pages/Contact.tsx` — Contact form + quick info
- `client/src/pages/CaseStudy.tsx` — Individual project case study
- `client/src/pages/admin/` — Full admin dashboard (Login, Dashboard, Projects, Playground, Messages, Settings)
- `client/src/components/Navbar.tsx` — Shared navbar with dark/light toggle
- `client/src/components/Footer.tsx` — Shared footer with dynamic content
- `client/src/lib/theme.tsx` — Light/dark theme provider + localStorage
- `server/routes.ts` — All API routes (public + /api/admin/*)
- `server/storage.ts` — DatabaseStorage backed by PostgreSQL
- `server/seed.ts` — Seeds admin user + sample projects, process steps, playground items, settings
- `shared/schema.ts` — Drizzle schema (source of truth for DB shape)
- `public/uploads/` — Uploaded images (served at /uploads/*)

## Architecture decisions

- Single Express server serves API + Vite SPA; admin routes protected by session middleware
- All portfolio content (projects, settings, etc.) is database-driven and editable via admin
- File uploads via multer stored in `public/uploads/` and served as static assets
- Password hashing uses Node's built-in crypto (scrypt) — no external bcrypt dependency
- Theme (light/dark) stored in localStorage and applied as class on `<html>` element

## Product

- **Home**: Dark hero with gradient text + featured project cards + "Why Work With Me"
- **Work**: Full projects list with case study links
- **About**: Bio, photo, skills, tools, hobbies, testimonials
- **Process**: 6-step design process with alternating layout
- **Playground**: Filterable grid of experiments (UI Concept, Micro-interaction, Data Viz, Tool)
- **Contact**: Form with validation + quick info + social links
- **Case Study**: Full project detail with problem, solution, results, key learnings
- **Admin Dashboard**: CRUD for projects, playground items, process steps, testimonials, site settings; view/delete contact messages; image upload

## Gotchas

- Run `npm run db:push` after any schema changes in `shared/schema.ts`
- Port is always 5000 in dev; Replit's `PORT` env var is respected in production
- Admin dashboard at `/admin` (redirects to `/admin/login` if not authenticated)
- Seed data is inserted only if tables are empty (idempotent)

## Pointers

- Shadcn UI: https://ui.shadcn.com
- Drizzle ORM: https://orm.drizzle.team
- TanStack Query v5: https://tanstack.com/query/v5
