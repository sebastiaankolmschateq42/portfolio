# Portfolio

Personal portfolio website of Sebastiaan Kolmschate, built for the Web Development semester (HBO-ICT, Windesheim). It shows a profile with projects, a contact form that delivers messages by email, and an Ask Me Anything page where visitors with an account ask questions that are answered live.

Design and security documentation (in Dutch) lives in [`docs/`](docs/).

## Requirements

- [Bun](https://bun.sh)
- Node.js 20 or higher
- Docker (for the local PostgreSQL database)

## Getting started

```bash
make setup
make dev
```

`make setup` installs dependencies and creates `.env.local` from `.env.example` (an existing `.env.local` is left alone). It also starts the database and applies the migrations. Fill in the values in `.env.local`; without mail settings the site logs emails to the console during development. Run `make db-seed` once to create the admin account.

The site runs at [http://localhost:3000](http://localhost:3000).

## Commands

| Command                | What it does                                           |
| ---------------------- | ------------------------------------------------------ |
| `make setup`           | Install dependencies and create `.env.local`           |
| `make install`         | Install dependencies only                              |
| `make dev`             | Start the database and the development server          |
| `make build`           | Production build                                       |
| `make test`            | Run the backend tests (Vitest)                         |
| `make check`           | Run lint, the format check and the tests, like CI      |
| `make cypress-install` | Download the Cypress app (also done by `make setup`)   |
| `make e2e`             | Run the Cypress end-to-end tests (app must be running) |
| `make component`       | Run the Cypress component tests                        |
| `make db-seed`         | Create or update the admin account                     |
| `make lint`            | Run ESLint                                             |
| `make prettier`        | Format all files                                       |
| `make prettier-check`  | Check formatting                                       |
| `make fix`             | Format and lint in one go                              |

CI runs `make lint`, `make prettier-check` and `make test` on every push and pull request, and the Cypress tests against a production build. Use `bun run cy:open` to watch the Cypress tests in a browser.
