.PHONY: setup install dev build lint prettier fix prettier-check test check

setup: install
	@test -f .env.local || (cp .env.example .env.local && echo "Created .env.local from .env.example")

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

check: lint prettier prettier-check