# Project Haven (working name)

A privacy-first mental health support platform. The product and engineering spec is in
[docs/specs/project1.md](docs/specs/project1.md).

**Current phase:** Phase 1, authentication and onboarding
([spec](docs/specs/havenphase-1.md), [implementation notes](docs/phase-1-auth.md)).

## Stack

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, Supabase
(Auth and Postgres with Row Level Security), zod, Vitest. Package manager: pnpm.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in your Supabase DEVELOPMENT project values
pnpm dev                     # http://localhost:3000
```

The landing page works without configuration. Sign-in, onboarding and the dashboard need
a Supabase project set up as described in [docs/phase-1-auth.md](docs/phase-1-auth.md).

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test            # unit tests
pnpm test:db:local   # database access-policy tests on local PostgreSQL
pnpm build
```

Use synthetic data only in development and testing. Never commit `.env.local` or any secret.
