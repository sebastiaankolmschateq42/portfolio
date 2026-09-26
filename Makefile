.PHONY: install dev build lint prettier prettier-check test

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