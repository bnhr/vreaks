# Templates

This directory contains templates and examples to help you scale your application. Templates are kept separate to prevent accidental execution and to provide clear examples when you need them.

## Directory Structure

```
templates/
├── ci-cd/          # CI/CD pipeline configurations
│   ├── github-actions-test.yml
│   └── gitlab-ci.yml
├── data-mode/      # React Router Data Mode examples
│   ├── user-queries.example.ts.md
│   ├── user-loader.example.ts.md
│   ├── user-actions.example.ts.md
│   ├── user-page.example.tsx.md
│   ├── router-config.example.tsx.md
│   ├── README.md
│   └── QUICK-START.md
└── testing/        # E2E test examples
    └── example.spec.ts.md
```

## Available Templates

### CI/CD Templates

Configuration templates for automated testing in CI/CD pipelines.

**Directory**: `ci-cd/`

**What's included:**
- `github-actions-test.yml` - GitHub Actions workflow configuration
- `gitlab-ci.yml` - GitLab CI pipeline configuration

**To use GitHub Actions:**
1. Create `.github/workflows/` directory if it doesn't exist
2. Copy `ci-cd/github-actions-test.yml` to `.github/workflows/test.yml`
3. Commit and push to trigger the workflow

**To use GitLab CI:**
1. Copy `ci-cd/gitlab-ci.yml` to `.gitlab-ci.yml` in your project root
2. Commit and push to trigger the pipeline

**Why templates?** These files are kept as templates to prevent accidental execution on free CI/CD plans, which could incur unexpected costs.

**Documentation:** [CI/CD Documentation](../docs/ci-cd.md)

---

### Data Mode Templates

Example files demonstrating the hybrid approach of React Router Data Mode + TanStack Query.

**Directory**: `data-mode/`

**What's included:**
- `user-queries.example.ts.md` - Query definitions with queryOptions()
- `user-loader.example.ts.md` - Loaders for data pre-fetching
- `user-actions.example.ts.md` - Actions for form handling
- `user-page.example.tsx.md` - Component using loader data
- `router-config.example.tsx.md` - Router configuration
- `README.md` - Complete guide and quick start
- `QUICK-START.md` - 5-minute implementation guide

**File format:** Templates use `.md` extension (e.g., `.ts.md`, `.tsx.md`) to prevent TypeScript/linting errors. Copy the content and save with the proper extension (`.ts`, `.tsx`).

**When to use:**
- Form-heavy features (actions simplify mutations)
- Route-level auth (middleware is cleaner)
- Performance optimization (parallel loaders)
- Scaling complexity (more structure as app grows)

**Quick start:**
1. Review `data-mode/README.md` for overview
2. Copy relevant template files to your feature
3. Update imports and types
4. Add loaders/actions to router config

**Why templates?** The current Declarative Mode + TanStack Query approach works well for most cases. Use Data Mode when you need its specific benefits.

**Documentation:** [Data Mode Migration Plan](../docs/data-mode-rr.md)

---

### Testing Templates

Example files demonstrating E2E test patterns with Playwright.

**Directory**: `testing/`

**What's included:**
- `example.spec.ts.md` - Comprehensive E2E test examples

**Patterns demonstrated:**
- Basic navigation tests
- Form submission flows
- Authentication flows
- Multi-step user flows
- API mocking
- Error state testing
- Responsive behavior testing

**To use:**
1. Review `testing/example.spec.ts.md` for patterns
2. Copy relevant examples to your `e2e/` directory
3. Adapt to your application's needs

**Documentation:** [Testing Guide](../docs/testing-guide.md)

---

## Philosophy

Templates are provided to help you scale when needed, not to add complexity upfront. Use them when:
- Your app grows beyond simple patterns
- You encounter specific problems they solve
- Your team needs more structure

For a starter project, the current implementation patterns are sufficient. These templates show you the path forward when you're ready.
