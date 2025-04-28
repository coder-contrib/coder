# Claude Guidelines for Coder Repository

This document provides guidelines for Claude when working with the Coder codebase.

## Code Style and Standards

- Follow Go best practices and existing patterns in the codebase
- Match the style of existing code when making changes
- Write thorough tests for new functionality
- Ensure code is well-documented with comments explaining "why" not just "what"
- Run tests before submitting changes

## Commit Conventions

- Use conventional commit format: `type(scope): message`
- Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`
- Keep commit messages concise and descriptive
- Reference issues/tickets when applicable

## PR Requirements

- Include proper documentation for new features
- Close related issues with "Closes #issue" in PR description
- Add thorough testing
- Explain complex changes or decisions in the PR description
- When adding new features, consider impacts on existing workflows

## Project Structure

- Understand the separation between core functionality and enterprise features
- Place new code in appropriate packages based on its functionality
- Respect API boundaries between different parts of the codebase
- Use standard Go project layout conventions

## Testing

- Write unit tests for all new functionality
- Ensure tests are deterministic and don't have race conditions
- Consider adding integration tests for complex features
- Mock external dependencies appropriately in tests

## Documentation

- Update relevant documentation when changing functionality
- Add clear docstrings to public functions and types
- Include examples where appropriate
- Update changelog entries for significant changes

## Experimental Features

- Use proper feature flags for experimental features
- Document experimental features clearly
- Consider migration paths when implementing experimental features
- Test experimental features thoroughly before general availability

## Security Considerations

- Never expose sensitive information in logs or error messages
- Validate all user inputs appropriately
- Follow principle of least privilege
- Consider security implications of new features or changes