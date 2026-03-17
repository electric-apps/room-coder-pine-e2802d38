# Todo App

A reactive, real-time todo application built with Electric SQL + TanStack DB. Todos sync instantly across all connected clients via Postgres shapes — add, complete, and delete tasks and see changes reflected everywhere in real time.

## Getting Started

```bash
pnpm install
pnpm dev:start
```

The app will be available at http://localhost:5173

## Features

- Create todos with a title
- Toggle todo completion with optimistic updates
- Delete todos
- Real-time sync across all connected clients via Electric SQL
- Task count indicator showing pending items

## Tech Stack

- **[Electric SQL](https://electric-sql.com/)** — Postgres-to-client real-time sync via shapes
- **[TanStack DB](https://tanstack.com/db)** — Reactive collections, live queries, and optimistic mutations
- **[Drizzle ORM](https://orm.drizzle.team/)** — Type-safe schema definitions and migrations
- **[TanStack Start](https://tanstack.com/start)** — React meta-framework with SSR + server functions
- **[Radix UI Themes](https://www.radix-ui.com/themes)** — Accessible, composable UI components

## License

MIT
