# WeeCommerce Deployment — Docker, Dokploy, CI/CD

**Version:** 1.0
**Target:** VPS 2GB RAM (Ubuntu 22.04 LTS), 5-container Docker stack, zero-downtime deploy
**Cost Target:** ≤ $10/month total infra
**Domain:** weecommerce.web.id

> Berkaitan: [ARCHITECTURE.md](./ARCHITECTURE.md) (container design) · [SECURITY.md](./SECURITY.md) (secrets, hardening) · [DATABASE.md §8](./DATABASE.md#8-backup--restore) (backup) · [CONTRIBUTING.md](./CONTRIBUTING.md) (local setup)

---

## Table of Contents

1. [Deployment Overview](#1-deployment-overview)
2. [Prerequisites](#2-prerequisites)
3. [Local Development Setup](#3-local-development-setup)
4. [Environment Variables](#4-environment-variables)
5. [Docker Setup](#5-docker-setup)
6. [Dokploy Deployment](#6-dokploy-deployment)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Database Migrations in Production](#8-database-migrations-in-production)
9. [Backup Strategy](#9-backup-strategy)
10. [Monitoring Setup](#10-monitoring-setup)
11. [Update & Maintenance](#11-update--maintenance)
12. [Rollback & Disaster Recovery](#12-rollback--disaster-recovery)

---

## 1. Deployment Overview

### 1.1 Architecture Recap

```
┌─────────────────────────────────────────────────────────┐
│ VPS (Ubuntu 22.04, 2GB RAM, 1 vCPU, 50GB SSD)           │
│ ├─ Docker Engine + Dokploy                              │
│ │   ├─ nginx (reverse proxy, :80/:443)                  │
│ │   ├─ nextjs (frontend, :3000 internal)                │
│ │   ├─ hono (API, :4000 internal)                       │
│ │   ├─ postgres (DB, :5432 internal)                    │
│ │   └─ redis (cache, :6379 internal)                    │
│ │                                                        │
│ │   External SaaS (via HTTPS):                          │
│ │   ├─ Cloudflare R2 (storage)                          │
│ │   ├─ Resend (email)                                   │
│ │   ├─ Sentry (errors)                                  │
│ │   ├─ UptimeRobot (uptime)                             │
│ │   └─ Plausible (analytics)                            │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Deployment Workflow

```
1. Developer push ke GitHub main
   │
2. GitHub Actions trigger
   ├─ Lint + typecheck + test
   ├─ Build Docker images (multi-stage)
   ├─ Trivy security scan
   ├─ Push images ke GHCR (GitHub Container Registry)
   └─ Trigger Dokploy webhook
   │
3. Dokploy
   ├─ Pull latest image
   ├─ Health check new container
   ├─ Zero-downtime swap (old → new)
   └─ Auto-rollback if health check fails
   │
4. Post-deploy
   ├─ Run migrations (if any, manual trigger)
   ├─ Sentry release tracking
   └─ Smoke test (curl /health)
```

### 1.3 Environment Strategy

| Environment | Branch | URL | Purpose |
|---|---|---|---|
| Local | `main` (working copy) | `localhost:3000` | Development |
| Staging | `main` branch (pre-tag) | `staging.weecommerce.web.id` | Pre-prod testing (MVP, required for admin auth) |
| Production | `main` tag (`v*`) | `weecommerce.web.id` | Live site |

MVP: staging wajib karena admin auth membutuhkan pre-prod testing. Deploy staging → verify → tag → deploy prod.

---

## 2. Prerequisites

### 2.1 VPS Specs & Providers

**Recommended providers** (sorted by price/value):

| Provider | Spec | Price | Notes |
|---|---|---|---|
| Contabo Cloud VPS 1 | 4 vCPU, 6GB RAM, 400GB SSD | €4.50/mo | Best value, EU/US/SG regions |
| Hetzner CX22 | 2 vCPU, 4GB RAM, 40GB SSD | €4.59/mo | EU, excellent value |
| Linode Shared 2GB | 1 vCPU, 2GB RAM, 50GB SSD | $12/mo | Reliable, simple |
| Vultr Cloud Compute | 1 vCPU, 2GB RAM, 55GB SSD | $12/mo | Many regions |
| DigitalOcean Basic | 1 vCPU, 2GB RAM, 50GB SSD | $12/mo | Mature ecosystem |

**For tight 2GB budget:** Contabo or Hetzner. **For headroom (recommended):** Contabo 6GB or Hetzner CX22.

### 2.2 Initial VPS Hardening

```bash
# 1. SSH into VPS as root
ssh root@<vps-ip>

# 2. Update system
apt update && apt upgrade -y

# 3. Create non-root user (don't run apps as root)
adduser alif
usermod -aG sudo alif

# 4. Copy SSH key to new user
rsync --archive --chown=alif:alif ~/.ssh /home/alif

# 5. Disable root SSH login + password auth
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# 6. Setup firewall (UFW)
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 7. Setup fail2ban (brute force protection)
apt install -y fail2ban
systemctl enable --now fail2ban

# 8. Setup automatic security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# 9. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker alif

# 10. Verify Docker Compose v2 (included)
docker compose version

# 11. Install rclone (for R2 backups)
curl https://rclone.org/install.sh | sudo bash
```

### 2.3 External Accounts Setup

Before deploying, create accounts and collect API keys:

| Service | Account | Keys to Collect |
|---|---|---|
| Cloudflare | Domain DNS + R2 storage | R2 Access Key ID, Secret, Account ID |
| Resend | Transactional email | API key, verify weecommerce.web.id domain |
| Sentry | Error tracking | DSN for web + api projects |
| UptimeRobot | Uptime monitoring | API key, monitor URLs |
| Plausible | Analytics | Site domain, script src |
| GitHub | Code + GHCR | PAT (for Dokploy pull) |
| Cloudflare Turnstile | Spam protection | Site key (public) + secret |

### 2.4 DNS Configuration

In Cloudflare DNS panel for `weecommerce.web.id`:

```
A     @          <VPS-IP>      Proxied (orange cloud)
A     www        <VPS-IP>      Proxied
CNAME cdn        <R2-public-url>.r2.dev   Proxied  (or use R2 custom domain)
```

**SSL mode:** Full (strict) jika pakai Let's Encrypt di VPS, atau "Flexible" jika biarin Cloudflare handle SSL.

---

## 3. Local Development Setup

### 3.1 Prerequisites (Local)

```bash
node --version  # 20.x
pnpm --version  # 9.x (or npm 10.x)
docker --version  # 24+
git --version  # 2.40+
```

### 3.2 Clone & Install

```bash
git clone https://github.com/<org>/weecommerce.git
cd weecommerce

# Install root deps (pnpm workspace)
pnpm install

# Install per-app deps
pnpm install --filter @weecommerce/web
pnpm install --filter @weecommerce/api
```

### 3.3 Environment

```bash
cp .env.example .env.local

# Edit .env.local with local values:
# - DATABASE_URL: postgresql://weecommerce:dev@localhost:5432/weecommerce
# - REDIS_URL: redis://localhost:6379
# - RESEND_API_KEY: your key (use Resend test mode)
# - TURNSTILE_SECRET: test key (Cloudflare provides test keys)
# - R2_*: your dev bucket keys
```

### 3.4 Start Dev Stack

**Option A: Docker Compose (recommended — mirrors prod)**

```bash
docker compose -f docker-compose.dev.yml up -d

# This starts postgres + redis only (next.js + hono run on host with hot reload)
# Then run apps:
pnpm dev  # runs both web + api via turborepo/concurrently
```

**Option B: Full host dev (lighter)**

```bash
docker compose -f docker-compose.dev.yml up -d postgres redis

# Run apps directly
pnpm --filter @weecommerce/web dev   # localhost:3000
pnpm --filter @weecommerce/api dev   # localhost:4000
```

### 3.5 Database Setup

```bash
# Run migrations
pnpm --filter @weecommerce/api db:migrate

# Seed data (services, FAQ, founder)
pnpm --filter @weecommerce/api db:seed

# Verify
docker compose -f docker-compose.dev.yml exec postgres psql -U weecommerce -c '\dt'
```

### 3.6 Access

| Service | URL |
|---|---|
| Next.js (web) | http://localhost:3000 |
| Hono API | http://localhost:4000 |
| API health | http://localhost:4000/health |
| Postgres | localhost:5432 (DBeaver/TablePlus) |
| Redis | localhost:6379 (RedisInsight) |

---

## 4. Environment Variables

### 4.1 .env.example (committed template)

```bash
# ===== Database =====
DATABASE_URL=postgresql://weecommerce:CHANGE_ME@postgres:5432/weecommerce
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
POSTGRES_USER=weecommerce
POSTGRES_DB=weecommerce

# ===== Redis =====
REDIS_URL=redis://redis:6379

# ===== App =====
NODE_ENV=production
LOG_LEVEL=info
NEXT_PUBLIC_SITE_URL=https://weecommerce.web.id

# ===== Email (Resend) =====
RESEND_API_KEY=re_CHANGE_ME
RESEND_FROM=hello@weecommerce.web.id
ADMIN_EMAIL=hello@weecommerce.web.id

# ===== Spam Protection (Cloudflare Turnstile) =====
TURNSTILE_SECRET=0xCHANGE_ME
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0xCHANGE_ME

# ===== Storage (Cloudflare R2) =====
R2_ACCOUNT_ID=CHANGE_ME
R2_ACCESS_KEY_ID=CHANGE_ME
R2_SECRET_ACCESS_KEY=CHANGE_ME
R2_BUCKET=weecommerce-media
R2_PUBLIC_URL=https://cdn.weecommerce.web.id

# ===== Webhook (n8n, optional) =====
WEBHOOK_URL=https://n8n.example.com/webhook/contact
WEBHOOK_SECRET=CHANGE_ME

# ===== Monitoring (Sentry) =====
SENTRY_DSN=https://CHANGE_ME@sentry.io/123
SENTRY_AUTH_TOKEN=CHANGE_ME
NEXT_PUBLIC_SENTRY_DSN=https://CHANGE_ME@sentry.io/456

# ===== Analytics (Plausible) =====
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=weecommerce.web.id
NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js

# ===== ISR Revalidation =====
REVALIDATE_SECRET=CHANGE_ME_RANDOM_STRING
API_URL=http://hono:4000  # internal Docker URL for Next.js Server Components
```

### 4.2 Per-Service Environment

| Service | Reads |
|---|---|
| `nextjs` | `API_URL`, `NEXT_PUBLIC_*`, `REVALIDATE_SECRET`, `SENTRY_DSN` |
| `hono` | `DATABASE_URL`, `REDIS_URL`, `RESEND_*`, `TURNSTILE_*`, `R2_*`, `WEBHOOK_*`, `SENTRY_DSN`, `ADMIN_EMAIL` |
| `postgres` | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` |
| `redis` | (none, defaults) |
| `nginx` | (none, static config) |

### 4.3 Secret Storage by Environment

| Env | Where | Encrypted? |
|---|---|---|
| Local | `.env.local` (gitignored) | No (dev only) |
| CI/CD | GitHub Secrets | Yes |
| Production | Dokploy env vars (per application) | Yes (at rest) |
| Backups | R2 server-side AES-256 | Yes |

> Detail secret management: [SECURITY.md §11](./SECURITY.md#11-secrets-management).

---

## 5. Docker Setup

### 5.1 Project Structure

```
weecommerce/
├── apps/
│   ├── web/                      # Next.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── app/
│   └── api/                      # Hono
│       ├── Dockerfile
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
├── packages/
│   └── db/                       # shared schema/migrations
│       └── migrations/
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── conf.d/
│   │       ├── default.conf
│   │       └── rate-limit.conf
│   └── db/
│       └── init/
│           ├── 0001_extensions.sql
│           └── 0002_seed.sql
├── docker-compose.yml            # production
├── docker-compose.dev.yml        # local dev
├── .dockerignore
├── .env.example
└── package.json                  # workspace root
```

### 5.2 Next.js Dockerfile (standalone output)

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat wget
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json* ./
COPY .npmrc ./
RUN npm ci --omit=dev=false

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runner (production) ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build (small footprint)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=30s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

**next.config.js** (enable standalone output):

```javascript
// apps/web/next.config.js
module.exports = {
  output: 'standalone',  // required for the Dockerfile above
  // ... rest of config (images, etc — see SEO.md §7.3)
};
```

### 5.3 Hono Dockerfile

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev=false

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build  # tsc → dist/

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache wget
RUN addgroup -g 1001 -S nodejs && adduser -S hono -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/db ./db  # migrations

USER hono

EXPOSE 4000
ENV PORT=4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=20s \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]
```

### 5.4 Production docker-compose.yml

Full file with all 5 services, networks, volumes, healthchecks.

> Reference: [ARCHITECTURE.md §2.3](./ARCHITECTURE.md#23-production-docker-composeyml) for the complete file.

### 5.5 Dev docker-compose.dev.yml

```yaml
# docker-compose.dev.yml
# Only starts postgres + redis. Apps run on host for hot reload.
services:
  postgres:
    image: postgres:16-alpine
    container_name: weecommerce-postgres-dev
    environment:
      - POSTGRES_USER=weecommerce
      - POSTGRES_PASSWORD=dev
      - POSTGRES_DB=weecommerce
    ports:
      - "5432:5432"
    volumes:
      - postgres-dev-data:/var/lib/postgresql/data
      - ./docker/db/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U weecommerce"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: weecommerce-redis-dev
    ports:
      - "6379:6379"
    volumes:
      - redis-dev-data:/data

volumes:
  postgres-dev-data:
  redis-dev-data:
```

### 5.6 .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.next
.git
.gitignore
README.md
.env*
.env.local
.env.example
coverage
.vscode
.idea
Dockerfile*
docker-compose*
.dockerignore
docs/
*.md
```

### 5.7 Nginx Config

> Full nginx.conf reference: [ARCHITECTURE.md §2.2](./ARCHITECTURE.md) + [SECURITY.md §3](./SECURITY.md#3-security-headers).

Place at `docker/nginx/nginx.conf` and `docker/nginx/conf.d/*.conf`. Mounted read-only into Nginx container.

---

## 6. Dokploy Deployment

[Dokploy](https://dokploy.com) is a self-hosted PaaS (Vercel alternative) — Docker-native, free, integrates with GitHub.

### 6.1 Install Dokploy on VPS

```bash
# Run Dokploy installer (as root or sudo user)
curl -sSL https://dokploy.com/install.sh | sh
```

This installs:
- Docker (if not present)
- Dokploy dashboard on `http://<vps-ip>:3000` (default)
- Traefik as reverse proxy (handles SSL via Let's Encrypt)

After install, access `http://<vps-ip>:3000`, create admin account.

### 6.2 Connect GitHub Repository

1. In Dokploy dashboard → **Settings → GitHub**.
2. Click **Connect GitHub**, authorize Dokploy.
3. Select `weecommerce` repository.

### 6.3 Create Applications

Create **2 applications** + **2 databases**:

#### Application 1: `weecommerce-web` (Next.js)
- **Source:** GitHub → `main` branch
- **Build type:** Dockerfile
- **Dockerfile location:** `apps/web/Dockerfile`
- **Port:** 3000
- **Health check path:** `/api/health`
- **Domains:** `weecommerce.web.id`, `www.weecommerce.web.id`
- **Environment variables:** (paste from `.env.production`, see §4)

#### Application 2: `weecommerce-api` (Hono)
- **Source:** GitHub → `main` branch
- **Build type:** Dockerfile
- **Dockerfile location:** `apps/api/Dockerfile`
- **Port:** 4000
- **Health check path:** `/health`
- **Internal domain:** `hono` (so Next.js can reach via `http://hono:4000`)
- **Environment variables:** DB, Redis, Resend, R2, Turnstile, Sentry keys

#### Database 1: PostgreSQL
- **Type:** PostgreSQL 16
- **Container name:** `postgres`
- **Internal domain:** `postgres`
- **Credentials:** user `weecommerce`, password = strong random, db `weecommerce`
- **Volume:** persistent `postgres-data`
- **Backup:** enable Dokploy built-in OR custom script (see §9)

#### Database 2: Redis
- **Type:** Redis 7
- **Container name:** `redis`
- **Internal domain:** `redis`
- **Maxmemory:** 256mb with `allkeys-lru` policy
- **Volume:** persistent `redis-data`

#### Static Service: Nginx (optional — Dokploy uses Traefik)
Dokploy ships Traefik as default reverse proxy. **Skip separate Nginx container** unless you need custom config (rate limit, specific headers). For MVP, let Traefik handle routing + SSL.

If you need Nginx for advanced rate limiting/security headers (recommended), deploy it as a **Compose service** that fronts `weecommerce-web` + `weecommerce-api`.

### 6.4 Configure Domains + SSL

In Dokploy:
1. Application `weecommerce-web` → **Domains** → Add `weecommerce.web.id`.
2. Toggle **HTTPS** — Dokploy provisions Let's Encrypt cert automatically.
3. Add redirect: `www.weecommerce.web.id` → `weecommerce.web.id`.
4. For `weecommerce-api`, set internal domain only (no public).

DNS must point to VPS IP (see §2.4) for cert provisioning to work.

### 6.5 Auto-Deploy

In each application:
- **Auto deploy:** ✅ Enabled
- **Branch:** `main`
- On push to `main`, Dokploy rebuilds + redeploys automatically.

### 6.6 Zero-Downtime Deploy

Dokploy uses Docker health checks to gate rollout:
1. Pull new image.
2. Start new container in parallel.
3. Wait for `/health` to return 200.
4. Switch Traefik routing from old to new.
5. Stop old container.

If health check fails within timeout (default 60s), Dokploy keeps old container running and marks deploy as failed — **automatic rollback**.

### 6.7 Manual Rollback

In Dokploy dashboard:
1. Application → **Deployments**.
2. Select previous successful deployment.
3. Click **Redeploy**.

Or via SSH + Docker:
```bash
# List images
docker images | grep weecommerce-web

# Run previous tag
docker stop weecommerce-web && docker rm weecommerce-web
docker run -d --name weecommerce-web ... weecommerce-web:<previous-sha>
```

---

## 7. CI/CD Pipeline

GitHub Actions workflow: lint → test → build → scan → push → deploy trigger.

### 7.1 .github/workflows/ci.yml

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_WEB: ghcr.io/${{ github.repository }}/web
  IMAGE_API: ghcr.io/${{ github.repository }}/api

jobs:
  # ---- Job 1: Lint + Test ----
  test:
    runs-on: ubuntu-latest
    outputs:
      sha: ${{ steps.meta.outputs.sha }}
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Unit tests
        run: pnpm test

      - name: Audit dependencies
        run: pnpm audit --audit-level=high
        continue-on-error: false

      - name: Extract metadata
        id: meta
        run: echo "sha=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

  # ---- Job 2: Build + Push Docker images ----
  build:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & push web image
        uses: docker/build-push-action@v5
        with:
          context: ./apps/web
          push: true
          tags: |
            ${{ env.IMAGE_WEB }}:latest
            ${{ env.IMAGE_WEB }}:${{ needs.test.outputs.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build & push api image
        uses: docker/build-push-action@v5
        with:
          context: ./apps/api
          push: true
          tags: |
            ${{ env.IMAGE_API }}:latest
            ${{ env.IMAGE_API }}:${{ needs.test.outputs.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Trivy scan web
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.IMAGE_WEB }}:${{ needs.test.outputs.sha }}
          severity: CRITICAL,HIGH
          exit-code: '1'

      - name: Trivy scan api
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.IMAGE_API }}:${{ needs.test.outputs.sha }}
          severity: CRITICAL,HIGH
          exit-code: '1'

  # ---- Job 3: Deploy ----
  deploy:
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Trigger Dokploy webhook
        run: |
          curl -X POST "${{ secrets.DOKPLOY_WEBHOOK_WEB }}" \
            -H "Authorization: Bearer ${{ secrets.DOKPLOY_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"tagName":"${{ needs.test.outputs.sha }}"}'

          curl -X POST "${{ secrets.DOKPLOY_WEBHOOK_API }}" \
            -H "Authorization: Bearer ${{ secrets.DOKPLOY_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"tagName":"${{ needs.test.outputs.sha }}"}'

      - name: Create Sentry release
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
        run: |
          curl -X POST "https://sentry.io/api/0/organizations/<org>/releases/" \
            -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
            -d '{"version":"${{ needs.test.outputs.sha }}","projects":["weecommerce-web","weecommerce-api"]}'

      - name: Smoke test
        run: |
          sleep 60  # wait for deploy
          curl -f https://weecommerce.web.id/api/health
          curl -f https://weecommerce.web.id/sitemap.xml | head -5
```

### 7.2 Required GitHub Secrets

In repository **Settings → Secrets and variables → Actions**:

| Secret | Purpose |
|---|---|
| `DOKPLOY_API_TOKEN` | Auth token for Dokploy API |
| `DOKPLOY_WEBHOOK_WEB` | Webhook URL to trigger web deploy |
| `DOKPLOY_WEBHOOK_API` | Webhook URL to trigger api deploy |
| `SENTRY_AUTH_TOKEN` | Sentry release tracking |

`GITHUB_TOKEN` is automatic — used to push to GHCR.

### 7.3 Required GitHub Environments

Create environment `production` in **Settings → Environments**:
- **Required reviewers:** Add `alifnugraha` (manual approval gate).
- **Wait timer:** 0 (immediate).

This adds a manual approval step before deploy — safety net against accidental `git push` triggering prod deploy.

---

## 8. Database Migrations in Production

### 8.1 Migration Strategy

- **Migrations are NOT auto-run on container start** (avoid surprising prod with schema changes).
- **Migrations run as separate explicit step** after deploy.
- **Backward-compatible migrations first:** additive changes (new column, new table) deploy before code that uses them.
- **Breaking migrations:** dual-deploy pattern (old + new code coexist during transition).

### 8.2 Migration Procedure (Zero-Downtime)

```bash
# 1. SSH into VPS
ssh alif@<vps-ip>

# 2. Backup current state (ALWAYS before migration)
docker exec weecommerce-postgres pg_dump -U weecommerce weecommerce \
  | gzip > ~/backups/pre-migration-$(date +%Y%m%d-%H%M%S).sql.gz

# 3. Upload backup to R2
rclone copy ~/backups/pre-migration-*.sql.gz r2:weecommerce-backups/db/pre-migration/

# 4. Run migration using a one-shot api container
docker compose -f /opt/weecommerce/docker-compose.yml run --rm \
  hono npm run db:migrate

# 5. Verify
docker exec weecommerce-postgres psql -U weecommerce -c '\dt'
docker exec weecommerce-postgres psql -U weecommerce -c '\d posts'  # check new schema

# 6. Smoke test endpoints
curl https://weecommerce.web.id/api/v1/posts | jq .
```

### 8.3 Migration Rollback

If migration broke something:

```bash
# 1. Stop apps (avoid writes)
docker compose stop hono nextjs

# 2. Restore from pre-migration backup
gunzip -c ~/backups/pre-migration-<timestamp>.sql.gz | \
  docker exec -i weecommerce-postgres psql -U weecommerce weecommerce

# 3. Roll back code (Dokploy dashboard: redeploy previous)
# 4. Restart apps
docker compose start hono nextjs

# 5. Verify
curl https://weecommerce.web.id/health
```

### 8.4 Migration Rules

1. **Never edit a migration that's been run in prod.** Create new migration to undo/change.
2. **Test in local first.** Run `db:migrate` locally before pushing.
3. **Backward-compatible preferred.** Add columns nullable first, backfill, then add NOT NULL later.
4. **One concern per migration.** Don't bundle unrelated changes.
5. **Idempotent where possible.** Use `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`.

---

## 9. Backup Strategy

### 9.1 What to Back Up

| Data | Frequency | Destination | Retention |
|---|---|---|---|
| PostgreSQL | Daily 2 AM UTC | R2 `weecommerce-backups/db/` | 30 daily + 12 weekly |
| R2 media files | Continuous (R2 versioning) | R2 itself | 90 days versions |
| Dokploy config | Weekly | R2 + local | 12 weeks |
| Nginx configs | On change (git) | GitHub | Forever (git history) |
| App env vars | On change | 1Password / Bitwarden | Forever |

### 9.2 Database Backup Script

```bash
#!/bin/bash
# /opt/weecommerce/scripts/backup-db.sh
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="weecommerce_${TIMESTAMP}.sql.gz"
R2_REMOTE="r2:weecommerce-backups/db/"
LOG_FILE="/var/log/weecommerce-backup.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting backup..."

# Dump + compress
docker exec weecommerce-postgres pg_dump \
  -U weecommerce \
  -d weecommerce \
  --no-owner \
  --no-privileges \
  --format=custom \
  | gzip > "/tmp/${BACKUP_FILE}"

# Verify non-empty
SIZE=$(stat -c%s "/tmp/${BACKUP_FILE}")
if [ "$SIZE" -lt 1000 ]; then
  log "ERROR: Backup too small ($SIZE bytes). Aborting."
  exit 1
fi

log "Backup created: ${BACKUP_FILE} ($SIZE bytes)"

# Upload to R2
if rclone copy "/tmp/${BACKUP_FILE}" "$R2_REMOTE"; then
  log "Uploaded to R2 successfully."
else
  log "ERROR: R2 upload failed."
  exit 1
fi

# Cleanup local
rm "/tmp/${BACKUP_FILE}"

# Cleanup old R2 backups (keep 30 daily)
rclone delete "$R2_REMOTE" --min-age 30d 2>/dev/null || true
log "Old backups cleaned."

# Weekly backup (Sunday): also save to weekly folder
if [ $(date +%u) -eq 7 ]; then
  rclone copy "${R2_REMOTE}${BACKUP_FILE}" "r2:weecommerce-backups/db-weekly/"
  rclone delete "r2:weecommerce-backups/db-weekly/" --min-age 365d 2>/dev/null || true
  log "Weekly snapshot saved."
fi

log "Backup complete."
```

### 9.3 Cron Setup

```bash
# Edit crontab
sudo crontab -e

# Add daily backup at 2 AM UTC
0 2 * * * /opt/weecommerce/scripts/backup-db.sh >> /var/log/weecommerce-backup.log 2>&1

# Weekly restore test (Sunday 4 AM)
0 4 * * 0 /opt/weecommerce/scripts/test-restore.sh >> /var/log/weecommerce-restore-test.log 2>&1
```

### 9.4 R2 Backup Bucket Setup

In Cloudflare R2 dashboard:
1. Create bucket `weecommerce-backups`.
2. Set lifecycle policy: auto-delete objects after 365 days (defense-in-depth even if script fails).
3. Create R2 API token with read/write scope to this bucket only.
4. Configure rclone:

```bash
rclone config
# Choose: Cloudflare R2 Storage
# Name: r2
# Account ID: <your-account-id>
# Access Key: <r2-token-access-key>
# Secret Key: <r2-token-secret>
```

### 9.5 Restore Procedure

```bash
# 1. List available backups
rclone lsf r2:weecommerce-backups/db/ | sort | tail -10

# 2. Download latest
LATEST=$(rclone lsf r2:weecommerce-backups/db/ | sort | tail -1)
rclone copy "r2:weecommerce-backups/db/${LATEST}" /tmp/

# 3. Decompress
gunzip "/tmp/${LATEST}"

# 4. Stop apps (prevent writes during restore)
cd /opt/weecommerce
docker compose stop hono nextjs

# 5. Drop & recreate schema (DESTRUCTIVE — only on restore)
docker exec weecommerce-postgres psql -U weecommerce -d weecommerce \
  -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'

# 6. Restore
SQL_FILE="${LATEST%.gz}"
docker exec -i weecommerce-postgres psql -U weecommerce -d weecommerce < "/tmp/${SQL_FILE}"

# 7. Verify tables
docker exec weecommerce-postgres psql -U weecommerce -c '\dt'

# 8. Restart apps
docker compose start hono nextjs

# 9. Smoke test
curl https://weecommerce.web.id/health
curl https://weecommerce.web.id/api/v1/services | jq .

# 10. Cleanup
rm "/tmp/${SQL_FILE}"
```

### 9.6 Weekly Restore Test

Automated script that verifies backup integrity by restoring to throwaway container:

```bash
#!/bin/bash
# /opt/weecommerce/scripts/test-restore.sh
set -euo pipefail

LOG=/var/log/weecommerce-restore-test.log
echo "[$(date)] Starting weekly restore test..." | tee -a "$LOG"

# Get latest backup
LATEST=$(rclone lsf r2:weecommerce-backups/db/ | sort | tail -1)
rclone copy "r2:weecommerce-backups/db/${LATEST}" /tmp/
gunzip "/tmp/${LATEST}"
SQL_FILE="/tmp/${LATEST%.gz}"

# Spin up throwaway Postgres
docker run --rm -d --name test-restore-pg \
  -e POSTGRES_USER=test \
  -e POSTGRES_PASSWORD=test \
  -e POSTGRES_DB=test \
  -p 5433:5432 \
  postgres:16-alpine

sleep 10

# Restore into it
if cat "$SQL_FILE" | docker exec -i test-restore-pg psql -U test -d test > /dev/null 2>&1; then
  TABLE_COUNT=$(docker exec test-restore-pg psql -U test -d test -t -c \
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
  echo "[$(date)] OK: Restore successful ($TABLE_COUNT tables)" | tee -a "$LOG"
else
  echo "[$(date)] FAIL: Restore failed — investigate backup ${LATEST}!" | tee -a "$LOG"
  # Send Slack alert
  curl -X POST "$SLACK_WEBHOOK" -d "{\"text\":\"⚠️ Backup restore test FAILED for ${LATEST}\"}"
fi

# Cleanup
docker rm -f test-restore-pg
rm "$SQL_FILE"
```

---

## 10. Monitoring Setup

### 10.1 Sentry

1. Create Sentry account → 2 projects: `weecommerce-web`, `weecommerce-api`.
2. Get DSN for each → set as env var.
3. For Next.js, install `@sentry/nextjs` and configure `sentry.client.config.ts`, `sentry.server.config.ts`, `instrumentation.ts`.
4. For Hono, install `@sentry/node`, init in `index.ts` (see [ARCHITECTURE.md §3.3](./ARCHITECTURE.md#33-hono-api-backend-monolith)).
5. Set `SENTRY_AUTH_TOKEN` in GitHub Secrets for release tracking (CI creates release per git SHA).
6. Configure alert rules: new error → email + Slack/Discord webhook.

### 10.2 UptimeRobot

1. Create account (free tier: 50 monitors, 5-min interval).
2. Add monitors:
   - `https://weecommerce.web.id/` — HTTP(s), 5 min, expect 200.
   - `https://weecommerce.web.id/api/health` — HTTP(s), 5 min, expect 200.
   - `https://weecommerce.web.id/sitemap.xml` — HTTP(s), 30 min, expect 200.
3. Alert contacts: email + Slack webhook.
4. Status page (optional): `status.weecommerce.web.id` (UptimeRobot free public status page).

### 10.3 Plausible Analytics

1. Create Plausible Cloud account ($9/mo) OR self-host.
2. Add site `weecommerce.web.id`.
3. Inject snippet in Next.js root layout:
   ```tsx
   // apps/web/app/layout.tsx
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Script
             defer
             data-domain="weecommerce.web.id"
             src="https://plausible.io/js/script.js"
           />
         </body>
       </html>
     );
   }
   ```
4. Configure custom events (goals):
   - `form_submit` — contact form success.
   - `whatsapp_click` — WhatsApp CTA click.
   - `cta_click` — any CTA.
   - `blog_read_complete` — scroll to end of blog post.

### 10.4 Self-Hosted Plausible (Optional Phase 2 Engage)

If avoiding Plausible Cloud cost, self-host:

```yaml
# Add to docker-compose.yml
plausible:
  image: plausible/community-edition:latest
  environment:
    - BASE_URL=https://plausible.weecommerce.web.id
    - SECRET_KEY_BASE=<generate>
    - DATABASE_URL=postgresql://plausible:...@postgres:5432/plausible
  depends_on: [postgres]
```

Trade-off: ~150–200MB extra RAM. Acceptable in 4GB VPS, tight in 2GB.

### 10.5 Log Access

```bash
# Live logs (all services)
docker compose logs -f

# Specific service
docker compose logs -f hono
docker compose logs -f nextjs

# Last 100 lines + filter errors
docker compose logs --tail 100 hono | grep ERROR

# JSON logs (structured)
docker compose logs hono | jq 'select(.level == "error")'
```

For longer retention + searchability (Phase 2 Engage): self-host Loki + Grafana, OR hosted service like Better Stack.

---

## 11. Update & Maintenance

### 11.1 Base Image Patching (Monthly)

Security updates for `node:20-alpine`, `postgres:16-alpine`, `redis:7-alpine`, `nginx:alpine`.

```bash
# Check current versions
docker images | grep -E 'node|postgres|redis|nginx'

# Pull latest (update Dockerfile tag → rebuild → CI rebuilds with new base)
# Or pull latest patch directly:
docker compose pull
docker compose up -d  # restarts with new images
```

Set calendar reminder: **first Sunday of each month** — check for base image updates.

### 11.2 Dependency Updates

**Renovate** (recommended) or **Dependabot** auto-creates PRs for npm + Docker base image updates.

Renovate config:

```json
// .renovaterc.json
{
  "extends": ["config:recommended", ":semanticCommits"],
  "schedule": ["before 6am on monday"],
  "npm": {
    "rangeStrategy": "bump"
  },
  "dockerfile": {
    "fileMatch": ["(^|/)Dockerfile.*$"]
  },
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": false,
      "groupName": "minor/patch"
    },
    {
      "matchUpdateTypes": ["major"],
      "dependencyDashboardApproval": true
    }
  ]
}
```

Review + merge PRs weekly. CI catches regressions.

### 11.3 Disk Cleanup

Docker accumulates orphan images/volumes. Monthly:

```bash
# Remove unused images, containers, networks (KEEP named volumes — data!)
docker image prune -af

# Check disk usage
docker system df
df -h
```

### 11.4 Log Rotation

Docker logs grow unbounded by default. Configure in `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker: `sudo systemctl restart docker`.

### 11.5 Certificate Renewal

Dokploy/Traefik auto-renews Let's Encrypt certs 30 days before expiry. Verify:

```bash
# Check cert expiry
echo | openssl s_client -servername weecommerce.web.id -connect weecommerce.web.id:443 2>/dev/null \
  | openssl x509 -noout -dates
```

---

## 12. Rollback & Disaster Recovery

### 12.1 Recovery Objectives

| Objective | Target |
|---|---|
| **RTO** (Recovery Time Objective) | < 1 hour |
| **RPO** (Recovery Point Objective) | < 24 hours (last nightly backup) |
| **MTTR** (Mean Time to Recovery) | < 30 minutes for app issues |

### 12.2 Rollback Decision Tree

```
Issue detected
├─ Is it code regression (deploy broke something)?
│  ├─ Yes → Roll back code (Dokploy dashboard → previous deploy)
│  └─ No → Continue
│
├─ Is it data issue (migration broke, bad data)?
│  ├─ Yes → Roll back code + restore DB from backup
│  └─ No → Continue
│
├─ Is it infrastructure (VPS down, network)?
│  ├─ Yes → Spin up new VPS, restore from R2 backup
│  └─ No → Continue
│
└─ Is it external service (R2, Resend down)?
   ├─ Yes → Graceful degradation (cache fallback), wait for service
   └─ No → Engage incident response (SECURITY.md §17)
```

### 12.3 Full Disaster Recovery (VPS Lost)

If VPS is lost (provider issue, corruption):

```bash
# 1. Provision new VPS
ssh root@<new-vps-ip>

# 2. Run initial hardening (see §2.2)

# 3. Install Dokploy
curl -sSL https://dokploy.com/install.sh | sh

# 4. Configure rclone with R2 credentials
rclone config  # set up r2 remote

# 5. In Dokploy dashboard:
#    - Connect GitHub repo
#    - Recreate applications with same env vars
#    - Add domain → triggers new SSL

# 6. Restore latest DB backup
LATEST=$(rclone lsf r2:weecommerce-backups/db/ | sort | tail -1)
rclone copy "r2:weecommerce-backups/db/${LATEST}" /tmp/
gunzip "/tmp/${LATEST}"
docker exec -i weecommerce-postgres psql -U weecommerce -d weecommerce < "/tmp/${LATEST%.gz}"

# 7. Update DNS to point to new VPS IP (Cloudflare, instant via proxy)
# 8. Verify
curl https://weecommerce.web.id/health

# Total recovery time: ~45 minutes
```

### 12.4 Backup Verification Schedule

| Frequency | Action |
|---|---|
| Daily | Auto-backup runs (cron) |
| Weekly | Auto-restore test (cron script) |
| Monthly | Manual: download backup, restore to local, run smoke tests |
| Quarterly | Full DR drill: simulate VPS loss, time the recovery |

---

## Summary

Deployment setup ini provide:

- ✅ **5-container stack** — Nginx + Next.js + Hono + PostgreSQL + Redis, fit di VPS 2GB.
- ✅ **Dokploy one-click** — Self-hosted PaaS, GitHub auto-deploy, zero-downtime.
- ✅ **CI/CD** — GitHub Actions: lint → test → build → Trivy scan → GHCR push → Dokploy trigger.
- ✅ **Zero-downtime** — Docker health checks gate rollout, auto-rollback on failure.
- ✅ **Backup** — Daily DB dump ke R2, 30 daily + 12 weekly retention, weekly restore test.
- ✅ **Disaster recovery** — Full DR procedure < 1 hour RTO.
- ✅ **Monitoring** — Sentry (errors), UptimeRobot (uptime), Plausible (analytics).
- ✅ **Maintenance** — Monthly base image patches, Renovate dependency PRs, log rotation.
- ✅ **Budget-friendly** — VPS $3–8/mo + Resend free + R2 free + SaaS free tiers = ≤ $10/mo total.

**Next:** [DESIGN.md](./DESIGN.md) untuk design system (Framer-inspired dark canvas + WeeCommerce teal brand + Hero component integration).
