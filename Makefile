.PHONY: setup cypress-install install dev build lint prettier fix prettier-check test db-up db-down db-migrate db-deploy db-reset db-seed db-test-prepare e2e component check

setup: install
	@test -f .env.local || (cp .env.example .env.local && echo "Created .env.local from .env.example")
	make db-up
	make db-deploy
	make cypress-install

# The Cypress app (~200 MB) is only needed to run the browser tests, so `bun install` skips it.
cypress-install:
	bunx cypress install

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

# Create or update the admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local
db-seed:
	bun prisma/seed.ts

# Separate database for tests, so tests never touch development data
TEST_DATABASE_URL = postgresql://portfolio:portfolio@localhost:5433/portfolio_test

db-test-prepare:
	-@docker compose exec -T db createdb -U portfolio portfolio_test 2>/dev/null
	DATABASE_URL=$(TEST_DATABASE_URL) bunx prisma migrate deploy

install:
	bun install

# Starts the database and applies pending migrations first, so one command is enough
dev: db-up db-deploy
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

test: db-test-prepare
	bun run test

# Everything CI checks, in one command: run before every push (never writes files)
check: lint prettier-check test

# Cypress end-to-end tests; needs the app running (make dev, or make build + bun run start)
e2e:
	bun run cy:e2e

# Cypress component tests; starts its own Vite server
component:
	bun run cy:component
