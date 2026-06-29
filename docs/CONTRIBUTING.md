# WeeCommerce Contributing Guide

**Version:** 1.0
**Audience:** Alif Nugraha (solo dev) + future contributors
**Stack:** Next.js 14 (Turbopack) + Hono + PostgreSQL + Shadcn/UI + Tailwind v4

> Berkaitan: [ARCHITECTURE.md](./ARCHITECTURE.md) (system) · [DEPLOYMENT.md](./DEPLOYMENT.md) (setup) · [DESIGN.md](./DESIGN.md) (components) · [SECURITY.md](./SECURITY.md) (rules) · [DATABASE.md](./DATABASE.md) (schema)

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Tech Stack Summary](#2-tech-stack-summary)
3. [Prerequisites](#3-prerequisites)
4. [Getting Started](#4-getting-started)
5. [Coding Standards](#5-coding-standards)
6. [Git Workflow](#6-git-workflow)
7. [Component Guidelines](#7-component-guidelines)
8. [Component Registry Workflow](#8-component-registry-workflow)
9. [API Guidelines](#9-api-guidelines)
10. [Database Guidelines](#10-database-guidelines)
11. [Testing Strategy](#11-testing-strategy)
12. [Accessibility Checklist](#12-accessibility-checklist)
13. [SEO Checklist](#13-seo-checklist)
14. [Performance Budget](#14-performance-budget)
15. [Documentation Standards](#15-documentation-standards)
16. [Resources](#16-resources)

---

## 1. Project Structure

Monorepo via pnpm workspaces.

```
weecommerce/
├── apps/
│   ├── web/                          # Next.js 14 (App Router, Turbopack)
│   │   ├── app/                      # Routes (App Router)
│   │   │   ├── (marketing)/          # Home, Services, Pricing, About, Contact
│   │   │   ├── blog/                 # Blog routes
│   │   │   ├── portfolio/            # Case studies
│   │   │   ├── api/                  # Next.js Route Handlers (page-only data, revalidation)
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # Shadcn + 21st.dev components (button, card, hero-1, dll)
│   │   │   └── blocks/               # Page-level sections (hero-section, pricing-grid)
│   │   ├── lib/                      # Utilities (utils.ts, markdown.ts, fetch.ts)
│   │   ├── public/                   # Static assets (logos, favicon)
│   │   ├── Dockerfile
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                          # Hono backend
│       ├── src/
│       │   ├── routes/               # public.ts, content.ts, contact.ts, seo.ts
│       │   ├── middleware/           # rateLimit.ts, errorHandler.ts
│       │   ├── lib/                  # db.ts, redis.ts, cache.ts, r2.ts, email.ts
│       │   ├── schemas/              # Zod schemas (shared dengan web)
│       │   └── index.ts              # App entry
│       ├── db/
│       │   └── migrations/           # SQL migrations
│       ├── Dockerfile
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── db/                           # Shared types + migration runner
│   │   ├── schema.ts                 # Drizzle/Zod schema types (Phase 2 client portal)
│   │   └── package.json
│   └── ui/                           # Shared UI tokens (Phase 2 client portal, if extracted)
│
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── conf.d/
│   └── db/
│       └── init/                     # 0001_extensions.sql, 0002_seed.sql
│
├── docs/                             # This documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── SEO.md
│   ├── SECURITY.md
│   ├── DEPLOYMENT.md
│   ├── DESIGN.md
│   ├── ROADMAP.md
│   ├── CONTRIBUTING.md
│   └── README.md
│
├── .github/
│   ├── workflows/                    # ci.yml, lighthouse.yml, security.yml
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docker-compose.yml                # production
├── docker-compose.dev.yml            # local dev
├── .env.example
├── .dockerignore
├── .gitignore
├── .npmrc
├── .nvmrc                            # node version pin
├── pnpm-workspace.yaml
├── package.json                      # workspace root
└── README.md
```

### 1.1 Why `/components/ui` is the Default

Shadcn/UI expects components in `components/ui/`. **Keep this convention** because:
- Shadcn CLI (`npx shadcn-ui@latest add button`) drops files there by default.
- 21st.dev components follow the same pattern (`@/components/ui/hero-1`).
- Import paths stay consistent: `import { Button } from "@/components/ui/button"`.
- Shared between marketing and admin pages without duplication.

Don't reorganize to `/components/shadcn/` or similar — breaks CLI + community components.

---

## 2. Tech Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 20 LTS |
| Package manager | pnpm | 9.x |
| Frontend | Next.js | 14+ (App Router, Turbopack) |
| UI components | Shadcn/UI (Radix + cva) | latest |
| Styling | Tailwind CSS | v4 |
| Icons | lucide-react | latest |
| Animation | framer-motion | latest |
| Backend | Hono | latest |
| Validation | Zod | latest |
| Database | PostgreSQL | 16 |
| DB client | node-postgres (`pg`) | latest |
| Cache | Redis | 7 |
| Redis client | `redis` (node-redis) | latest |
| Email | Resend | latest |
| Storage | Cloudflare R2 (`@aws-sdk/client-s3`) | latest |
| Spam protection | Cloudflare Turnstile | latest |
| Analytics | Plausible | latest |
| Error tracking | Sentry | latest |
| Testing | Vitest + Playwright | latest |
| Linting | ESLint + Prettier | latest |
| Deployment | Docker + Dokploy | latest |

Detail: [PRD.md §7](./PRD.md#7-architecture-overview).

---

## 3. Prerequisites

### 3.1 Required Tools

```bash
# Verify versions
node --version    # v20.x (use .nvmrc to auto-switch)
pnpm --version    # 9.x
docker --version  # 24+
git --version     # 2.40+

# Recommended editors
# VS Code with extensions:
#   - ESLint
#   - Prettier
#   - Tailwind CSS IntelliSense
#   - PostCSS syntax
#   - PostgreSQL (by ckolkman)
```

### 3.2 Accounts Needed (Local Dev)

| Service | Purpose | Get |
|---|---|---|
| Resend | Email (use test mode) | API key at resend.com |
| Cloudflare | R2 dev bucket | API token at dash.cloudflare.com |
| Cloudflare Turnstile | Spam protection | Use **test keys** for local dev |
| Sentry | Errors (optional local) | DSN at sentry.io |

For local-only testing without external services, mock them:
- `RESEND_API_KEY=re_test_...` (Resend intercepts in test mode)
- Turnstile test keys: `1x00000000000000000000AA` (always passes)

---

## 4. Getting Started

### 4.1 Clone & Install

```bash
git clone https://github.com/<org>/weecommerce.git
cd weecommerce

# Use correct Node version
nvm use  # reads .nvmrc

# Install workspace deps
pnpm install
```

### 4.2 Environment

```bash
cp .env.example .env.local

# Edit .env.local with local values
# Key values for local dev:
#   DATABASE_URL=postgresql://weecommerce:dev@localhost:5432/weecommerce
#   REDIS_URL=redis://localhost:6379
#   RESEND_API_KEY=re_test_xxx  (or your test key)
#   TURNSTILE_SECRET=1x00000000000000000000AA  (test key, always passes)
#   NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

### 4.3 Start Dev Environment

```bash
# Start Postgres + Redis in Docker
docker compose -f docker-compose.dev.yml up -d

# Run migrations + seed
pnpm --filter @weecommerce/api db:migrate
pnpm --filter @weecommerce/api db:seed

# Start both apps (web + api) with hot reload
pnpm dev
```

### 4.4 Verify

| URL | Expected |
|---|---|
| http://localhost:3000 | Next.js home page |
| http://localhost:4000/health | `{"status":"ok",...}` |
| http://localhost:4000/api/v1/services | Array of 4 tiers |

### 4.5 Common Scripts

```bash
# Workspace root (runs across all packages)
pnpm dev              # Start web + api
pnpm build            # Build all
pnpm lint             # Lint all
pnpm typecheck        # TypeScript check
pnpm test             # Run all tests
pnpm test:e2e         # Playwright e2e

# Per-app
pnpm --filter @weecommerce/web dev
pnpm --filter @weecommerce/api dev
pnpm --filter @weecommerce/api db:migrate
pnpm --filter @weecommerce/api db:seed
```

---

## 5. Coding Standards

### 5.1 TypeScript

- **Strict mode** on (`"strict": true` in tsconfig).
- No `any` — use `unknown` + type guard, or define proper type.
- Explicit return types for exported functions.
- Prefer `interface` for object shapes, `type` for unions/intersections.

```typescript
// ✅ Good
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad
const submission: any = await fetchSubmission();
```

### 5.2 ESLint + Prettier

`.eslintrc.json` (root):

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

`.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### 5.3 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files (components) | kebab-case | `service-card.tsx`, `hero-1.tsx` |
| Files (utilities) | kebab-case | `rate-limit.ts`, `error-handler.ts` |
| React components | PascalCase | `ServiceCard`, `HeroSection` |
| Functions | camelCase | `getService()`, `formatPrice()` |
| Variables | camelCase | `serviceData`, `isLoading` |
| Types/Interfaces | PascalCase | `ContactSubmission`, `ServiceTier` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_BASE_URL` |
| DB tables | snake_case plural | `form_submissions`, `case_studies` |
| DB columns | snake_case | `published_at`, `service_tier` |
| CSS classes | kebab-case (Tailwind default) | `bg-card`, `text-foreground` |
| Env vars | UPPER_SNAKE | `DATABASE_URL`, `RESEND_API_KEY` |
| Route paths | kebab-case | `/services/convert`, `/blog/apa-itu-rag` |

### 5.4 Import Order

```typescript
// 1. External (npm)
import { Hono } from 'hono';
import { z } from 'zod';
import * as Sentry from '@sentry/node';

// 2. Internal absolute (@/ alias)
import { db } from '@/lib/db';
import { rateLimit } from '@/middleware/rateLimit';

// 3. Relative
import { contactSchema } from '../schemas/contact';
import { helper } from './utils';

// 4. Types (type-only imports)
import type { ContactSubmission } from '@/types';
```

### 5.5 File Size Limits

- Components: ≤ 200 lines. Extract sub-components if larger.
- Route handlers: ≤ 100 lines. Move logic to `lib/`.
- Utility files: ≤ 300 lines. Split by concern.

---

## 6. Git Workflow

### 6.1 Branch Naming

```
<type>/<short-description>

Examples:
feat/contact-form
fix/sitemap-missing-posts
docs/api-endpoints
chore/upgrade-nextjs
refactor/extract-pricing-card
```

Types:
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation only
- `chore` — Tooling, deps, config
- `refactor` — Code restructure (no behavior change)
- `test` — Adding tests
- `perf` — Performance improvement

### 6.2 Commit Messages (Conventional Commits)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Examples:

```
feat(contact): add Turnstile spam protection

Integrate Cloudflare Turnstile widget into contact form.
Server-side verification in Hono /api/v1/contact endpoint.

Closes #42
```

```
fix(seo): include blog posts in sitemap

Blog posts were missing from sitemap.xml because the query
filtered by wrong status value.

Closes #58
```

```
docs(api): add public AI API endpoints spec
```

### 6.3 PR Template

`.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description

[What does this PR do? Why?]

## Type of Change

- [ ] feat — New feature
- [ ] fix — Bug fix
- [ ] docs — Documentation
- [ ] refactor — Code restructure
- [ ] chore — Tooling/deps
- [ ] test — Tests

## Checklist

- [ ] Code follows style guide (lint + format pass)
- [ ] TypeScript types correct (typecheck pass)
- [ ] Tests added/updated (coverage maintained)
- [ ] Documentation updated (if API/feature change)
- [ ] No secrets in code
- [ ] Accessibility checked (if UI)
- [ ] SEO impact considered (if content/route change)
- [ ] Performance impact considered (no new heavy deps)

## Testing

[How did you verify this works?]

## Screenshots (if UI change)

[Before/after if visual]
```

### 6.4 Code Review Checklist

Reviewer verifies:

- [ ] No `any` types.
- [ ] No `console.log` (use logger).
- [ ] No secrets in code.
- [ ] Error handling present (try/catch or Hono error middleware).
- [ ] Input validated (Zod schema for any user input).
- [ ] No SQL string concat (parameterized queries only).
- [ ] DB queries use indexes (check EXPLAIN for new queries).
- [ ] Components ≤ 200 lines.
- [ ] Accessibility: keyboard nav, ARIA, contrast.
- [ ] Tests cover happy path + edge cases.

---

## 7. Component Guidelines

### 7.1 When to Use Shadcn/UI

**Always start with Shadcn.** It's the base. Use for:
- Button, Card, Dialog, Dropdown, Input, Select, Textarea, Table, Tabs, Toast, Tooltip, Accordion, Avatar, Badge, Separator, Skeleton.

```bash
# Add a Shadcn component
npx shadcn-ui@latest add button card dialog
```

### 7.2 When to Extract a Component

Extract to its own file when:
- Used in 2+ places.
- Has complex logic (> 50 lines).
- Has its own state.
- Reusable with different props.

```tsx
// ✅ Extracted: apps/web/components/ui/pricing-card.tsx
export function PricingCard({ tier, currency, featured }: PricingCardProps) {
  return (/* ... */);
}

// Used in: apps/web/app/pricing/page.tsx
<PricingCard tier={launchTier} currency="idr" />
```

### 7.3 Component Structure

```tsx
// apps/web/components/ui/service-card.tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// 1. Types
export interface ServiceCardProps {
  service: ServiceTier;
  variant?: 'default' | 'compact';
  className?: string;
}

// 2. Component
export function ServiceCard({ service, variant = 'default', className }: ServiceCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-5', className)}>
      {/* ... */}
    </div>
  );
}
```

### 7.4 Props Conventions

- Always type props with `interface` (not inline type).
- Optional props have defaults.
- `className` prop always available (for Tailwind overrides via `cn()`).
- Spread rest props: `{...props}`.

### 7.5 Server vs Client Components

- **Default: Server Component** (no `'use client'`).
- **Client Component only when needed:**
  - State (`useState`, `useReducer`).
  - Effects (`useEffect`).
  - Event handlers (`onClick`, `onChange`).
  - Browser APIs (`localStorage`, `window`).
  - Third-party client-only libs (framer-motion, Turnstile widget).

```tsx
// ✅ Server Component (default)
export function ServiceList({ services }: { services: ServiceTier[] }) {
  return (
    <ul>
      {services.map(s => <li key={s.id}>{s.name}</li>)}
    </ul>
  );
}

// ✅ Client Component (needs interactivity)
'use client';
import { useState } from 'react';

export function CurrencyToggle() {
  const [currency, setCurrency] = useState<'idr' | 'usd'>('idr');
  return (/* ... */);
}
```

---

## 8. Component Registry Workflow

How to integrate components from external registries (21st.dev, Shadcn/UI, Kinetics Colorion).

### 8.1 Approved Registries

| Registry | URL | Use For |
|---|---|---|
| **Shadcn/UI** | https://ui.shadcn.com | Base components — copy-paste, full control |
| **21st.dev** | https://21st.dev | Community components — hero-1, bento-pricing, infinite-slider |
| **Kinetics Colorion** | https://kinetics.colorion.co | Animation/motion patterns reference |

### 8.2 Integration Steps

1. **Find component** (e.g., `21st.dev/efferd/bento-pricing`).
2. **Copy files** to `apps/web/components/ui/`:
   - Main file: `bento-pricing.tsx`
   - Sub-dependencies: any referenced files (e.g., `pricing-card.tsx`).
3. **Replace tokens** with WeeCommerce design tokens:
   - `bg-blue-500` / `bg-violet-*` → `bg-primary` (teal).
   - Non-Inter fonts → `font-display` (Space Grotesk) for headings.
   - `rounded-lg` on CTAs → `rounded-full` (pill).
   - Gradient backgrounds → solid `bg-card` + Intelligence Grid overlay (per DESIGN.md §8).
4. **Install NPM deps** listed by component (e.g., `framer-motion`, `react-use-measure`).
5. **Test in isolation**:
   ```
   apps/web/app/_dev/[component-name]/page.tsx
   ```
6. **Quality gate** (DESIGN.md §15.3):
   - [ ] No external brand colors (teal only).
   - [ ] No gradient backgrounds.
   - [ ] CTAs are pills.
   - [ ] Headings use Space Grotesk.
   - [ ] Min 44px touch targets.
   - [ ] Keyboard accessible.
7. **Integrate into page.**

### 8.3 Curated Component List (Already Identified)

See [DESIGN.md §15.4](./DESIGN.md#154-curated-component-list-mvp) for the list of components planned for MVP.

### 8.4 Adaptation Examples

**From 21st.dev `hero-1` → WeeCommerce Hero:**

Original:
```tsx
<h1>Built to convert. Wired to learn.</h1>
<a href="#link">E-commerce, powered by AI!</a>
```

Adapted (kept copy, swapped tokens, added Intelligence Grid):
```tsx
<h1 className="font-display text-6xl font-semibold tracking-tight">
  Built to convert. <br /> Wired to learn.
</h1>
<div className="intelligence-grid absolute inset-0 -z-10" />
```

---

## 9. API Guidelines

### 9.1 Hono Route Structure

```typescript
// apps/api/src/routes/contact.ts
import { Hono } from 'hono';
import { rateLimit } from '../middleware/rateLimit';
import { contactSchema } from '../schemas/contact';
import { db } from '../lib/db';
import { email } from '../lib/email';
import { turnstile } from '../lib/turnstile';

const app = new Hono();

app.post(
  '/contact',
  rateLimit({ limit: 5, windowSeconds: 3600, keyPrefix: 'contact' }),
  async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: 'Invalid JSON' }, 400);

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({
        error: 'Validation Error',
        status: 422,
        message: 'Please check the highlighted fields',
        details: parsed.error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      }, 422);
    }

    // ... process
  }
);

export default app;
```

### 9.2 Route File Conventions

- One resource per file (`posts.ts`, `contact.ts`, `services.ts`).
- Mount in `index.ts`: `app.route('/api/v1/posts', postsRoute)`.
- All input validated with Zod schema from `schemas/`.
- All DB queries parameterized (no string concat).
- Errors thrown to global error handler (don't try/catch everything).

### 9.3 Zod Schemas (Shared)

```typescript
// apps/api/src/schemas/contact.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  company: z.string().min(2).max(255),
  message: z.string().min(20).max(5000),
  phone: z.string().max(30).optional().or(z.literal('')),
  serviceInterest: z.enum(['launch', 'convert', 'scale', 'integrate']).optional(),
  turnstileToken: z.string().min(1),
  _hp_field: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

> **MVP:** Move shared schemas to `packages/db/` so both `web` and `api` import from one source.

### 9.4 Error Handling

```typescript
// Throw HTTP errors with status
throw new HTTPException(404, { message: 'Post not found' });

// Or return directly
return c.json({ error: 'Not Found', status: 404 }, 404);
```

Global error handler captures + sends to Sentry: [ARCHITECTURE.md §8.1](./ARCHITECTURE.md#81-global-error-handler-hono).

---

## 10. Database Guidelines

### 10.1 Migration First

**Never edit the DB schema directly.** Always via migration file.

```bash
# Create new migration
pnpm --filter @weecommerce/api db:migrate:create add_post_views_column
# Creates: db/migrations/0004_add_post_views_column.sql
```

### 10.2 Migration Rules

1. **Never edit a migration that's been run in prod.** Create new migration to revert/change.
2. **One concern per migration.** Don't bundle unrelated changes.
3. **Backward-compatible preferred.** Add nullable columns first, backfill, then NOT NULL.
4. **Idempotent where possible.** Use `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`.
5. **Test locally first.** Run `db:migrate` locally before pushing.

### 10.3 Query Patterns

```typescript
// ✅ Parameterized (safe from SQL injection)
const post = await db.queryOne(
  'SELECT * FROM posts WHERE slug = $1 AND status = $2',
  [slug, 'published']
);

// ❌ NEVER string concat
const post = await db.queryOne(`SELECT * FROM posts WHERE slug = '${slug}'`);
```

Detail: [SECURITY.md §9](./SECURITY.md#9-sql-injection-prevention) + [DATABASE.md §7](./DATABASE.md#7-migration-strategy).

### 10.4 Naming

- Tables: `snake_case` plural (`form_submissions`).
- Columns: `snake_case` (`published_at`, `service_tier`).
- Foreign keys: `<entity>_id` (`author_id`, `category_id`).
- Booleans: `is_<adjective>` (`is_published`, `is_confidential`).
- Timestamps: `*_at` (`created_at`, `published_at`, `deleted_at`).

---

## 11. Testing Strategy

### 11.1 Testing Pyramid

```
        ┌─────────┐
        │   E2E   │  Playwright (slow, expensive, few)
        │  5–10   │
        └─────────┘
       ┌───────────┐
       │Integration│  Vitest integration (DB, API)
       │  30–50    │
       └───────────┘
     ┌───────────────┐
     │     Unit      │  Vitest unit (fast, many)
     │    100–200    │
     └───────────────┘
```

### 11.2 Coverage Target

- **Unit + integration: ≥ 80%** (overall).
- **Critical paths: 100%** (contact form, auth, payment-related code).

### 11.3 Test File Location

```
apps/web/components/ui/button.tsx
apps/web/components/ui/button.test.tsx      ← co-located

apps/api/src/routes/contact.ts
apps/api/src/routes/contact.test.ts         ← co-located

tests/e2e/contact-form.spec.ts              ← root-level e2e
tests/e2e/blog-search.spec.ts
```

### 11.4 Unit Test Example (Vitest)

```typescript
// apps/api/src/schemas/contact.test.ts
import { describe, it, expect } from 'vitest';
import { contactSchema } from './contact';

describe('contactSchema', () => {
  const validInput = {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme',
    message: 'This is a valid message with enough characters.',
    turnstileToken: 'valid-token',
  };

  it('accepts valid input', () => {
    expect(contactSchema.safeParse(validInput).success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...validInput, email: 'not-email' });
    expect(result.success).toBe(false);
  });

  it('rejects short message', () => {
    const result = contactSchema.safeParse({ ...validInput, message: 'short' });
    expect(result.success).toBe(false);
  });

  it('rejects filled honeypot', () => {
    const result = contactSchema.safeParse({ ...validInput, _hp_field: 'bot' });
    expect(result.success).toBe(false);
  });
});
```

### 11.5 E2E Test Example (Playwright)

```typescript
// tests/e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test';

test('contact form submits successfully', async ({ page }) => {
  await page.goto('/contact');

  await page.fill('[name=name]', 'Test User');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=company]', 'Test Co');
  await page.fill('[name=message]', 'This is a test message for e2e.');

  // Wait for Turnstile (test mode auto-passes)
  await page.waitForTimeout(2000);

  await page.click('button[type=submit]');

  await expect(page.locator('text=Thank you')).toBeVisible({ timeout: 10000 });
});
```

### 11.6 Run Tests

```bash
pnpm test              # All unit + integration
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage report
pnpm test:e2e          # Playwright (needs dev server running)
```

---

## 12. Accessibility Checklist

WCAG 2.1 AA compliance. Run check before every PR with UI changes.

### 12.1 Pre-PR Checklist

- [ ] **Semantic HTML:** Use `<main>`, `<article>`, `<nav>`, `<section>`, `<aside>`, `<header>`, `<footer>`.
- [ ] **Headings:** Exactly one `<h1>` per page. Logical hierarchy (no H1 → H3 skips).
- [ ] **Labels:** All form inputs have associated `<label>` (or `aria-label`).
- [ ] **Alt text:** All informative images have descriptive `alt`. Decorative images have `alt=""`.
- [ ] **Color contrast:** Text ≥ 4.5:1, large text ≥ 3:1. (Test with WebAIM Contrast Checker.)
- [ ] **Keyboard nav:** Tab through all interactive elements. Visible focus indicator.
- [ ] **Touch targets:** Min 44×44px on mobile.
- [ ] **ARIA:** Use only when semantic HTML insufficient. Don't over-use.
- [ ] **Screen reader:** Test with NVDA (Windows) or VoiceOver (Mac).
- [ ] **`prefers-reduced-motion`:** Respect — disable non-essential animations.
- [ ] **Color not sole info:** Icon + text, not just color (e.g., error states).
- [ ] **Lighthouse Accessibility ≥ 95.**

### 12.2 Shadcn Accessibility

Shadcn/Radix components are accessible by default. Don't break their ARIA patterns when customizing.

```tsx
// ✅ Good — Shadcn Dialog is accessible
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

---

## 13. SEO Checklist

Run before every PR that adds/changes routes or content.

### 13.1 Pre-PR Checklist

- [ ] **Meta title:** 50–60 chars, unique, keyword early.
- [ ] **Meta description:** 150–160 chars, unique, compelling.
- [ ] **Canonical URL:** Set via Next.js `metadata.canonical`.
- [ ] **Open Graph:** `og:title`, `og:description`, `og:image` (1200×630), `og:url`.
- [ ] **Twitter Card:** `summary_large_image` for blog/portfolio.
- [ ] **JSON-LD:** Appropriate schema for page type (Organization, Article, FAQPage, etc.).
- [ ] **Heading hierarchy:** 1 H1, then H2/H3 logical.
- [ ] **Image alt text:** Descriptive, includes keyword if natural.
- [ ] **Internal links:** At least 2–3 relevant internal links per page.
- [ ] **URL structure:** Lowercase, descriptive, no special chars.
- [ ] **Sitemap:** New route added to sitemap (auto via Hono on content publish).
- [ ] **robots:** Page should be indexable (or `noindex` if private).
- [ ] **AI meta tags:** `ai:author`, `ai:published-date`, `ai:updated-date` on blog posts.
- [ ] **Lighthouse SEO ≥ 95.**

Detail: [SEO.md](./SEO.md).

---

## 14. Performance Budget

Hard limits. CI fails if exceeded.

### 14.1 Budget

| Metric | Limit | Tool |
|---|---|---|
| Initial JS bundle | < 200KB (gzipped) | Bundle analyzer |
| Initial CSS | < 30KB (gzipped) | Bundle analyzer |
| LCP element | < 2.5s | Lighthouse CI |
| Total page weight | < 1.5MB | Lighthouse |
| Image (hero) | < 200KB | Manual check |
| Image (other) | < 100KB each | Manual check |
| Font files | ≤ 3 families, ≤ 4 weights total | Manual check |
| Third-party scripts | ≤ 3 (Plausible, Turnstile, Sentry) | Manual check |

### 14.2 Lighthouse CI Budget

```json
// lighthouse-budget.json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "interactive": ["warn", { "maxNumericValue": 3500 }],
        "total-byte-weight": ["warn", { "maxNumericValue": 1500000 }]
      }
    }
  }
}
```

### 14.3 Performance Tips

- **Server Components by default** (zero hydration cost).
- **`next/image`** for all images (auto WebP, srcset, lazy load).
- **`next/font`** for fonts (self-hosted, `display: swap`).
- **Dynamic import** heavy client libs (`await import('framer-motion')`).
- **`loading="lazy"`** for below-fold images and iframes.
- **Code split** per route (Next.js does this automatically).

---

## 15. Documentation Standards

### 15.1 Keep Docs in Sync

**Update docs in the same PR that changes code.** If you add an API endpoint, update `API.md`. If you add a DB table, update `DATABASE.md`.

### 15.2 Inline Comments

- **Comment WHY, not WHAT.** Code should be self-documenting for the "what."
- **Complex logic:** Explain the algorithm or business rule.
- **TODOs:** Use `// TODO(phase-X): description` format, link to issue.

```typescript
// ✅ Good comment
// Use sliding window because fixed window allows burst at boundary
async function checkRateLimit(ip: string, zone: string) { ... }

// ❌ Bad comment
// Check rate limit
async function checkRateLimit(ip: string, zone: string) { ... }
```

### 15.3 README Files

- Root `README.md` — Project overview, quickstart, links to docs.
- Per-app `README.md` (optional) — App-specific notes.
- `docs/README.md` — Index of all docs (cross-reference map).

### 15.4 Changelog

Maintain `CHANGELOG.md` (root) following [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [Unreleased]

### Added
- Public AI API endpoints (`/api/v1/public/*`)
- Intelligence Grid signature element

### Changed
- Pricing layout to bento grid

### Fixed
- Sitemap missing blog posts (#58)

## [1.0.0] — 2026-06-28

### Added
- Initial MVP release
```

---

## 16. Resources

### 16.1 Internal Documentation

| Doc | When to Read |
|---|---|
| [PRD.md](./PRD.md) | Understand product scope, requirements |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Understand system design, container layout |
| [DATABASE.md](./DATABASE.md) | Schema reference, write queries |
| [API.md](./API.md) | API endpoint reference |
| [SEO.md](./SEO.md) | SEO/GEO requirements, JSON-LD templates |
| [SECURITY.md](./SECURITY.md) | Security rules, CSP, validation patterns |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy process, Docker, Dokploy |
| [DESIGN.md](./DESIGN.md) | Design tokens, component specs |
| [ROADMAP.md](./ROADMAP.md) | What's in MVP vs future phases |

### 16.2 External Resources

| Resource | URL | Use |
|---|---|---|
| Next.js Docs | https://nextjs.org/docs | App Router, Server Components |
| Shadcn/UI | https://ui.shadcn.com | Component docs, theming |
| Hono Docs | https://hono.dev | API framework |
| Tailwind CSS | https://tailwindcss.com/docs | Utility classes, v4 |
| Zod | https://zod.dev | Schema validation |
| Drizzle ORM | https://orm.drizzle.dev | (Phase 2 client portal) Type-safe queries |
| Radix UI | https://www.radix-ui.com | Primitives (under Shadcn) |
| lucide-react | https://lucide.dev | Icons |
| framer-motion | https://www.framer.com/motion | Animations |
| Cloudflare R2 | https://developers.cloudflare.com/r2 | Storage API |
| Resend | https://resend.com/docs | Email API |
| Plausible | https://plausible.io/docs | Analytics |
| 21st.dev | https://21st.dev | Component registry |
| Kinetics Colorion | https://kinetics.colorion.co | Animation reference |

### 16.3 Brand Reference

| Doc | Use |
|---|---|
| [WeeCommerce-Brand-Blueprint.txt](../WeeCommerce-Brand-Blueprint.txt) | Strategic brand reference (positioning, ICP, offering, GTM) |
| [WeeCommerce-Company-Profile.txt](../WeeCommerce-Company-Profile.txt) | External-facing company description, copy reference |

### 16.4 Community / Help

- **GitHub Issues** — Bug reports, feature requests.
- **GitHub Discussions** — Questions, ideas.
- **Slack/Discord** (internal) — Quick questions.

---

## Summary

Contributing guide ini provide:

- ✅ **Clear project structure** — Monorepo layout, `/components/ui/` convention.
- ✅ **Coding standards** — TypeScript strict, ESLint/Prettier, naming conventions.
- ✅ **Git workflow** — Conventional Commits, branch naming, PR template, review checklist.
- ✅ **Component guidelines** — When to use Shadcn, when to extract, Server vs Client Components.
- ✅ **Component registry workflow** — How to integrate 21st.dev/Shadcn components with Wead tokens.
- ✅ **API guidelines** — Hono route structure, Zod validation, error handling.
- ✅ **Database guidelines** — Migration first, parameterized queries, naming.
- ✅ **Testing strategy** — Vitest + Playwright, ≥80% coverage, co-located tests.
- ✅ **Accessibility checklist** — WCAG AA, Shadcn defaults.
- ✅ **SEO checklist** — Meta, JSON-LD, AI tags.
- ✅ **Performance budget** — Hard limits enforced by Lighthouse CI.
- ✅ **Documentation standards** — Keep docs in sync, comment WHY.
- ✅ **Resource index** — Internal docs + external links.

**Welcome aboard. Build something that works.** 🚀
