# CI/CD Templates

This directory contains CI/CD configuration templates that you can use to set up automated testing for your project.

## Available Templates

### GitHub Actions

**File**: `github-actions-test.yml`

To use this template:
1. Create `.github/workflows/` directory if it doesn't exist
2. Copy `github-actions-test.yml` to `.github/workflows/test.yml`
3. Commit and push to trigger the workflow

### GitLab CI

**File**: `gitlab-ci.yml`

To use this template:
1. Copy `gitlab-ci.yml` to `.gitlab-ci.yml` in your project root
2. Commit and push to trigger the pipeline

## Why Templates?

These files are kept as templates to prevent accidental execution on free CI/CD plans, which could incur unexpected costs. Copy and configure them only when you're ready to enable CI/CD for your project.

## Documentation

For detailed information about CI/CD configuration, see [CI/CD Documentation](../docs/ci-cd.md).
