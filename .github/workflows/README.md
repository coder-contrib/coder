# Coder GitHub Actions Workflows

This directory contains GitHub Actions workflows used to build, test, and release Coder.

## Overview

The main workflows are:

- **ci.yaml**: Main CI workflow for running tests and linting that runs on all PRs and pushes to main.

## Workflows

### CI Workflow (ci.yaml)

The CI workflow is responsible for running tests and linting on all PRs and pushes to main. It consists of the following jobs:

1. **lint-go**: Runs Go linting with golangci-lint and formatting checks.
2. **lint-ts**: Runs JavaScript/TypeScript linting and type checking.
3. **test-go-core**: Runs Go tests on core packages that don't require complex environment setup.
4. **test-go-utils**: Runs Go tests on utility packages.
5. **test-js-basic**: Runs JavaScript/TypeScript unit tests for utils, hooks, and APIs.
6. **build-checks**: Verifies all Go and TypeScript packages compile.
7. **required**: Ensures all required checks have passed.

This CI workflow is designed to balance coverage and reliability. It tests a significant portion of the codebase but avoids tests requiring complex environment setup that could be problematic in forked repositories.

The full test suite in the original repository also includes database tests, platform-specific tests, and end-to-end tests that require additional resources and setup.

## Local Testing

You can test the workflows locally using [act](https://github.com/nektos/act).

```bash
# Install act
brew install act

# Run CI workflow locally
act -j test-go-core

# Run a specific job
act -j lint-go
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