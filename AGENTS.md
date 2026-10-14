<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: portfolio with realtime guestbook

School assignment for the modules Client- and Server Technology and Security for Web
Applications. Deadline: October 1st, 2026.

## AI policy (important)

The owner writes all application code and all school documentation personally. AI agents
are used transparently for: advice, explanations, debugging help, code review (including
automated PR reviews), and commit assistance.

Agents must NOT write feature code or school documentation. Give direction, explain
trade-offs, review diffs, illustrate with short snippets — the owner types and must be
able to explain every line.

## Language

- Site UI: English (labels, validation messages, routes like /projects, /guestbook)
- School documentation in docs/: Dutch
- Code, comments, commits: English

## Stack and conventions

- Next.js 16 App Router — params are Promises (`await params`); check
  node_modules/next/dist/docs/ before assuming API shapes
- TypeScript, Tailwind CSS 4, EB Garamond via next/font
- Bun is the package manager. Never use npm or introduce a package-lock.json
- Zod for all validation: client-side via React Hook Form + zodResolver, server-side via
  safeParse in route handlers (400 with field errors)
- Static content lives in typed TS files validated with `.parse()` at import time
- Vitest for backend tests; always mock external services (mail)
- Secrets only via environment variables (.env.example lists the names). Never hardcode
  secrets; bcrypt-only password verification, JWT_SECRET is required at startup

## Build commands (Makefile wraps bun)

- `make dev` — dev server on localhost:3000
- `make build` — production build (also catches type/param errors dev mode misses)
- `make lint` / `make prettier` / `make prettier-check` — ESLint / format / format check
- `make test` — Vitest run

Before any commit: `make lint && make prettier-check && make test` must pass.

## CI/CD and git flow

- GitHub Actions (.github/workflows/ci.yml) runs on every push to main/develop and on
  every PR: `bun install --frozen-lockfile`, then make lint, make prettier-check,
  make test. Anything red locally is red in CI — same commands
- Branch flow: feature branch from develop → PR (body contains `Closes #N` for the
  ticket) → squash merge when CI is green (`gh pr merge --squash --auto --delete-branch`)
  → develop to main via PR at milestones. Never push to main directly
- Tickets are GitHub issues (F1–F5 features, T10 finish); acceptance criteria in the
  issue are the definition of done, together with a written documentation section
