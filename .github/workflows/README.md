# Coder GitHub Actions Workflows

This directory contains GitHub Actions workflows used to build, test, and release Coder.

## Overview

The main workflows are:

- **ci.yaml**: Main CI workflow for running tests, linting, and building the code. This is a lightweight version that runs on all PRs and pushes to main.

## Workflows

### CI Workflow (ci.yaml)

The CI workflow is responsible for running tests and linting on all PRs and pushes to main. It consists of the following jobs:

1. **changes**: Determines what files have changed to run only the necessary jobs.
2. **lint**: Lints the code using golangci-lint and other tools.
3. **test-go**: Runs Go tests.
4. **test-js**: Runs JavaScript/TypeScript tests.
5. **required**: Ensures all required checks have passed.

## Local Testing

You can test the workflows locally using [act](https://github.com/nektos/act).

```bash
# Install act
brew install act

# Run CI workflow locally
act -j test-go

# Run a specific job
act -j lint
```