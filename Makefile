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

prettier-check:
	bun run format:check

test:
	bun run test