# Makefile for common project commands
.PHONY: dev build migrate seed backup restore

dev:
	pnpm dev

build:
	docker compose build

migrate:
	pnpm --filter @weecommerce/api db:migrate

seed:
	pnpm --filter @weecommerce/api db:seed

backup:
	@echo "Run: docker exec weecommerce-postgres pg_dump -U weecommerce weecommerce | gzip > backup_$(date +%Y%m%d).sql.gz"

restore:
	@echo "Run: gunzip -c backup_*.sql.gz | docker exec -i weecommerce-postgres psql -U weecommerce weecommerce"
