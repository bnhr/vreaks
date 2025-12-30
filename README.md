# VREAKS

> An opinionated React starter with Vite and Bun for modern SPA development

A production-ready React template with best practices baked in. Built for speed with Vite and Bun, featuring a clean architecture and modern state management.

## Features

- ⚡ Lightning-fast with Vite + Bun
- 🎯 TypeScript strict mode
- 🎨 Tailwind CSS v4
- 🔄 TanStack Query for server state
- 🐻 Zustand for client state
- 🧪 Vitest + Testing Library + Playwright
- 📁 Feature-based architecture
- 🎭 Mock API mode for development
- 🔒 Auth flow included
- ✨ ESLint + Prettier configured

## Quick Start

**Prerequisites:** Bun installed ([get it here](https://bun.sh))

```bash
git clone https://github.com/bnhr/vreaks.git your-project-name
cd your-project-name
bun install
cp .env.example .env
bun run dev
```

Remove git history to start fresh:

```bash
rm -rf .git
git init
```

## Project Structure

```
src/
├── app/           # App configuration, providers, routes
├── features/      # Feature modules (auth, users, etc.)
│   └── auth/      # Example: authentication feature
│       ├── api/   # API calls and React Query hooks
│       ├── components/
│       ├── hooks/
│       └── types/
├── pages/         # Page components
├── shared/        # Shared utilities, components, hooks
│   ├── api/       # API client and configuration
│   ├── components/
│   ├── hooks/
│   └── lib/
├── widgets/       # Complex reusable UI components
├── mock/          # Mock API for development
└── test/          # Test setup and utilities
```

## State Management Philosophy

**Three-tier approach:**

1. **Server State** → TanStack Query (user data, API calls)
2. **Client State** → Zustand (theme, UI state, preferences)
3. **Local State** → useState (component-specific)

**No React Context.** We use Zustand for global client state and React Query for server state.

## Commands

```bash
bun run dev        # Start dev server
bun run build      # Build for production
bun run preview    # Preview production build
bun run lint       # Lint code
bun run format     # Format code
bun run test       # Run all tests (unit + component)
bun run test:e2e   # Run E2E tests with Playwright
```

## Mock API

Develop without a backend. Mock API uses localStorage and simulates network delays.

**Default credentials:**
- Admin: `admin` / any password
- User: `user` / any password

**Toggle in `.env`:**
```env
VITE_USE_MOCK_API=true   # Mock mode (default)
VITE_USE_MOCK_API=false  # Real backend
```

**Reset data:** Clear localStorage in DevTools or run `localStorage.clear()`

## Documentation

- [Testing Guide](./docs/testing.md) - Complete testing documentation
- [Agent Guidelines](./docs/agents.md) - Guidelines for AI agents
- [CI/CD Setup](./docs/ci-cd.md) - CI/CD configuration guide

## Testing

This project uses a modern three-tier testing approach with real browser testing:

- **Unit Tests** - Fast tests for pure functions (Vitest + Node.js)
- **Component Tests** - React components in real browsers (Vitest Browser Mode)
- **E2E Tests** - Complete user flows (Playwright)

```bash
# Run all tests
bun run test

# Run E2E tests
bun run test:e2e

# Run with coverage
bun run test --coverage
```

See [Testing Documentation](./docs/testing.md) for more details.

## Best Practices

- **Naming:** Use kebab-case for files and folders
- **Components:** Functional components with TypeScript
- **Testing:** Test user behavior, not implementation
- **No `any`:** Use `unknown` if type is unclear
- **Commits:** Use conventional commits (`feat:`, `fix:`, etc.)

See [Agent Guidelines](./docs/agents.md) for detailed best practices.

## Contributing

This is a personal template, but discussions and suggestions are welcome. Open an issue to share ideas or feedback.

## License

MIT
