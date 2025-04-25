# Coder GitHub Actions Workflows

This directory contains GitHub Actions workflows used to build, test, and release Coder.

## Overview

The main workflows are:

- **ci.yaml**: Main CI workflow for running lightweight tests and linting that runs on all PRs and pushes to main.

## Workflows

### CI Workflow (ci.yaml)

The CI workflow is responsible for running basic tests and linting on all PRs and pushes to main. It consists of the following jobs:

1. **lint-basic**: Runs basic code formatting checks with goimports and go fmt.
2. **test-go-basic**: Runs a small subset of Go tests that don't require complex environment setup.
3. **test-js-basic**: Runs basic JavaScript/TypeScript linting.
4. **required**: Ensures all required checks have passed.

We've intentionally kept this CI workflow lightweight and focused on the most basic checks to ensure it runs quickly and reliably in forked repositories. The full test suite requires significant resources and specific environment setup that may not be available in all contexts.

## Local Testing

You can test the workflows locally using [act](https://github.com/nektos/act).

```bash
# Install act
brew install act

# Run CI workflow locally
act -j test-go-basic

# Run a specific job
act -j lint-basic
```

## Additional Testing

For more comprehensive testing, you can use the following commands:

```bash
# Run all Go tests (requires full environment setup)
make test

# Run all JavaScript tests
cd site && pnpm test

# Run the full linting suite
make lint
```