# WeeCommerce

E-Commerce Systems, Powered by AI.

**Stack:** Next.js 14 + Hono + PostgreSQL + Redis + Docker
**Domain:** weecommerce.web.id
**Docs:** See [`docs/`](./docs)

## Quick Start

```bash
# Prerequisites
node --version  # 20.x
pnpm --version  # 9.x
docker --version  # 24+

# Install deps
pnpm install

# Copy env
cp .env.example .env.local

# Start dev DB + cache
pnpm docker:dev

# Run migrations + seed
pnpm db:migrate
pnpm db:seed

# Start dev servers
pnpm dev
# → Web: http://localhost:3000
# → API: http://localhost:4000/health
```

## Documentation

All project docs in [`docs/`](./docs):

| Doc | What |
|---|---|
| [PRD.md](./docs/PRD.md) | Product requirements |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design |
| [DATABASE.md](./docs/DATABASE.md) | Schema & migrations |
| [API.md](./docs/API.md) | REST API specification |
| [SEO.md](./docs/SEO.md) | SEO & GEO |
| [SECURITY.md](./docs/SECURITY.md) | Security hardening |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Docker, CI/CD |
| [DESIGN.md](./docs/DESIGN.md) | Design system |
| [ROADMAP.md](./docs/ROADMAP.md) | Phases & milestones |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Dev guidelines |

## License

Proprietary — WeeCommerce © 2026 Alif Nugraha.
# WeeCommerce-dockploy
