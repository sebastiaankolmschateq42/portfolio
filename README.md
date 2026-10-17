# Portfolio

Personal portfolio website of Sebastiaan Kolmschate, built for the Web Development semester (HBO-ICT, Windesheim). It shows projects and has a contact form that delivers messages by email.

Design and security documentation (in Dutch) lives in [`docs/`](docs/).

## Requirements

- [Bun](https://bun.sh)
- Node.js 20 or higher

## Getting started

```bash
make setup
make dev
```

`make setup` installs dependencies and creates `.env.local` from `.env.example` (an existing `.env.local` is left alone). Fill in the values there; without SMTP values the site still works and logs emails to the console.

The site runs at [http://localhost:3000](http://localhost:3000).

## Commands

| Command               | What it does                                  |
| --------------------- | --------------------------------------------- |
| `make setup`          | Install dependencies and create `.env.local`  |
| `make install`        | Install dependencies only                     |
| `make dev`            | Start the database and the development server |
| `make build`          | Production build                              |
| `make test`           | Run the tests (Vitest)                        |
| `make lint`           | Run ESLint                                    |
| `make prettier`       | Format all files                              |
| `make prettier-check` | Check formatting                              |
| `make fix`            | Format and lint in one go                     |

CI runs `make lint`, `make prettier-check` and `make test` on every push and pull request.
