.PHONY: setup cypress-install install dev build lint prettier fix prettier-check test db-up db-down db-migrate db-deploy db-reset db-seed db-test-prepare e2e component check

setup: install
	@test -f .env.local || (cp .env.example .env.local && echo "Created .env.local from .env.example")
	make db-up
	make db-deploy
	make cypress-install

cypress-install:
	bunx cypress install

db-up:
	docker compose up -d --wait

db-down:
	docker compose down

db-migrate:
	bunx prisma migrate dev

db-deploy:
	bunx prisma migrate deploy

db-reset:
	bunx prisma migrate reset --force

db-seed:
	bun prisma/seed.ts

TEST_DATABASE_URL = postgresql://portfolio:portfolio@localhost:5433/portfolio_test

db-test-prepare:
	-@docker compose exec -T db createdb -U portfolio portfolio_test 2>/dev/null
	DATABASE_URL=$(TEST_DATABASE_URL) bunx prisma migrate deploy

install:
	bun install

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

check: lint prettier-check test

e2e:
	bun run cy:e2e

component:
	bun run cy:component
