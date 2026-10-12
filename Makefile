.PHONY: setup install dev build lint prettier fix prettier-check test db-up db-down db-migrate db-deploy db-reset

setup: install
	@test -f .env.local || (cp .env.example .env.local && echo "Created .env.local from .env.example")
	make db-up
	make db-deploy

db-up:
	docker compose up -d --wait

db-down:
	docker compose down

# Create a new migration from schema changes (development only)
db-migrate:
	bunx prisma migrate dev

# Apply existing migrations without creating new ones (setup, CI, production)
db-deploy:
	bunx prisma migrate deploy

# Drop all data and re-apply every migration
db-reset:
	bunx prisma migrate reset --force

install:
	bun install

dev:
	bun run dev

build:
	bun run build

lint:
	bun run lint

prettier:
	bun run format

fix:
	make prettier && make lint

prettier-check:
	bun run format:check

test:
	bun run test