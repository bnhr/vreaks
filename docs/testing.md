# Testing Documentation

This project uses a modern, three-tier testing approach with real browser testing.

## Test Types

- **Unit Tests** - Fast tests for pure functions and utilities (Vitest + Node.js)
- **Component Tests** - Tests for React components in real browsers (Vitest Browser Mode)
- **E2E Tests** - Tests for complete user flows (Playwright)

## Quick Start

```bash
# Run all tests (unit + component)
bun run test

# Run E2E tests
bun run test:e2e

# Run with coverage
bun run test --coverage
```

## Key Features

- ✅ Real browser testing (no JSDOM limitations)
- ✅ Automatic resource cleanup with disposables
- ✅ Fast unit tests in Node.js
- ✅ Component tests in real Chromium browser
- ✅ E2E tests with screenshots/videos on failure
- ✅ CI/CD ready with headless mode

## Documentation

- [Testing Guide](./testing-guide.md) - Comprehensive guide on when and how to test
- [Disposables Guide](./disposables.md) - Automatic resource cleanup pattern
- [Quick Reference](./quick-reference.md) - Cheat sheet for common testing tasks
- [Test Utilities](./test-utilities.md) - Documentation for test helper functions

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
