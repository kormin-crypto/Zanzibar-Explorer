# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Applications

### Zanzibar Tourism Website (`artifacts/zanzibar-tourism`)
- Frontend: React + Vite, Tailwind CSS, Shadcn/UI, wouter routing
- Brand: "Zanzibar Pearl" tourism site
- Color palette: deep teal (Indian Ocean), warm ivory (sand), coral accent
- Fonts: Cormorant Garamond (display/serif) + Inter (body)
- Pages: Home, Packages, Package Detail, Activities, Trip Builder, Contact
- Features:
  - Browse and filter tourism packages (beach, adventure, cultural, luxury, family)
  - Interactive trip builder with step-by-step flow
  - Live cost estimator (accommodation + activities + guide + taxes)
  - Booking inquiry form
  - Package detail pages with photo gallery and cost estimate widget

### API Server (`artifacts/api-server`)
- Express 5 REST API
- Routes: /api/packages, /api/packages/:id, /api/packages/featured, /api/activities, /api/accommodations, /api/estimate, /api/inquiries, /api/summary
- Zod validation using generated schemas from OpenAPI spec

## Database Schema

Tables:
- `packages` — Tourism packages with accommodation, pricing, highlights, category
- `package_activities` — Join table for packages and activities
- `activities` — Activities with category, price/person, duration
- `accommodations` — Accommodations with type, price/night, amenities, stars
- `inquiries` — Booking inquiries from customers

Seeded with:
- 5 packages (beach, cultural, adventure, luxury, family)
- 12 activities (snorkeling, spice tour, stone town walk, dhow cruise, diving, etc.)
- 6 accommodations (luxury villas, eco lodges, boutique hotels, guesthouses)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
