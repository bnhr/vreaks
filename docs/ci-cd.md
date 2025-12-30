# CI/CD Configuration Guide

This document describes the CI/CD configuration for the testing infrastructure.

## Overview

The project uses a dual-testing approach with separate CI jobs for unit/component tests and E2E tests. Both GitHub Actions and GitLab CI configurations are provided as templates.

## Test Scripts

### Local Development

- `bun run test` - Run tests in watch mode
- `bun run test:e2e` - Run E2E tests with UI
- `bun run test:e2e:ui` - Run E2E tests with Playwright UI

### CI/CD

- `bun run test:ci` - Run all tests once with coverage reporting
- `bun run test:e2e:ci` - Run E2E tests with GitHub reporter

## Environment Detection

The test configuration automatically detects CI environments by checking for:
- `CI=true`
- `GITHUB_ACTIONS=true`
- `GITLAB_CI=true`
- `CIRCLECI=true`
- `TRAVIS=true`

When CI is detected:
- Tests run in headless mode
- Parallel execution is optimized for CI
- Server instances are not reused
- Artifacts are preserved on failure

## Parallel Execution

### Vitest (Unit/Component Tests)

- **Local**: Uses half of available CPU cores for better system responsiveness
- **CI**: Uses all available CPU cores for maximum speed
- Configuration: `vitest.config.ts` → `test.poolOptions.threads`

### Playwright (E2E Tests)

- **Local**: Runs tests in parallel (default)
- **CI**: Runs tests sequentially (`workers: 1`) for stability
- Configuration: `playwright.config.ts` → `workers`

## Coverage Reporting

Coverage is collected using Vitest's V8 provider and includes:

### Reporters
- `text` - Console output
- `json` - Machine-readable JSON
- `html` - Interactive HTML report
- `lcov` - For CI integration (Codecov, Coveralls, etc.)

### Thresholds
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

### Included Files
- All TypeScript/TSX files in `src/`

### Excluded Files
- Test files (`*.test.ts`, `*.spec.ts`)
- Test utilities (`src/test/`)
- Mock data (`src/mock/`)
- Entry points (`src/main.tsx`)
- Type definitions (`src/vite-env.d.ts`)

## Artifact Preservation

### GitHub Actions

#### Coverage Reports
- **Path**: `coverage/`
- **Retention**: 30 days
- **Upload**: Always (even on failure)

#### Playwright Reports
- **Path**: `playwright-report/`
- **Retention**: 30 days
- **Upload**: Always (even on failure)

#### Test Artifacts (Screenshots/Videos)
- **Path**: `test-results/`
- **Retention**: 7 days
- **Upload**: Only on failure

### GitLab CI

#### Coverage Reports
- **Path**: `coverage/`
- **Retention**: 30 days
- **Upload**: Always
- **Integration**: Cobertura format for GitLab coverage visualization

#### E2E Artifacts
- **Paths**: `playwright-report/`, `test-results/`
- **Retention**: 7 days
- **Upload**: Always

## Artifact Retention Policy

| Artifact Type | Retention | Upload Condition | Rationale |
|--------------|-----------|------------------|-----------|
| Coverage Reports | 30 days | Always | Track coverage trends over time |
| Playwright HTML Reports | 30 days | Always | Review test execution details |
| Screenshots/Videos | 7 days | On failure | Debug failing tests, short retention to save storage |

## CI/CD Templates

CI/CD configuration templates are available in the `templates/` directory:

- `templates/github-actions-test.yml` - GitHub Actions workflow
- `templates/gitlab-ci.yml` - GitLab CI pipeline

**Note**: These are templates to prevent accidental execution on free plans. Copy and configure them as needed for your CI/CD platform.

## Troubleshooting

### Tests Fail in CI but Pass Locally

1. **Check environment detection**: Ensure CI environment variables are set correctly
2. **Verify headless mode**: Some tests may behave differently in headless browsers
3. **Check timing**: CI may be slower, adjust timeouts if needed
4. **Review artifacts**: Download screenshots/videos from failed runs

### Coverage Thresholds Not Met

1. **Review coverage report**: Check which files/lines are not covered
2. **Add missing tests**: Focus on untested branches and functions
3. **Adjust thresholds**: If necessary, lower thresholds temporarily in `vitest.config.ts`

### Artifacts Not Uploading

1. **Check paths**: Ensure artifact paths match actual output directories
2. **Verify permissions**: Ensure CI has write access to artifact storage
3. **Check retention**: Artifacts may have expired based on retention policy

## Best Practices

1. **Run tests locally before pushing**: Use `bun run test:ci` to simulate CI environment
2. **Review coverage reports**: Aim to maintain or improve coverage with each PR
3. **Check artifacts on failures**: Always review screenshots/videos when E2E tests fail
4. **Keep dependencies updated**: Regularly update Playwright and Vitest for bug fixes
5. **Monitor CI performance**: Track test execution time and optimize slow tests

## Integration with External Services

### Codecov

Add to GitHub Actions after coverage generation:

```yaml
- name: Upload to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
    token: ${{ secrets.CODECOV_TOKEN }}
```

### Coveralls

Add to GitHub Actions after coverage generation:

```yaml
- name: Upload to Coveralls
  uses: coverallsapp/github-action@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    path-to-lcov: ./coverage/lcov.info
```
