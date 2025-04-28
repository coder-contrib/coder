# Claude Guidelines for Coder Repository

This document provides guidelines for Claude when working with the Coder codebase.

## Code Style and Standards

- Follow Go best practices and existing patterns in the codebase
- Match the style of existing code when making changes
- Write thorough tests for new functionality
- Ensure code is well-documented with comments explaining "why" not just "what"
- Run tests before submitting changes
- Design clean, higher-level APIs with appropriate method visibility
- Keep public interfaces minimal and focused; don't expose methods only used for testing
- Balance theoretical correctness with practical considerations

## API Design Principles

- Public APIs should be intentional, not accidental
- Consider who the users of your API are and what they need
- Avoid exposing internal implementation details
- Design for future extensibility without breaking changes
- Provide meaningful error messages that aid in debugging
- Consider backward compatibility implications

## Error Handling

- Be pragmatic with error handling - focus on realistic failure scenarios
- Balance defensive coding against code complexity
- Ensure critical paths have appropriate error handling
- Consider the diagnostic value of error messages for operators
- Propagate context with errors when it adds debugging value

## Concurrency and Performance

- Pay careful attention to concurrency and potential race conditions
- Be explicit about guarantees of sequential execution
- Consider performance implications, particularly for database operations
- Optimize database queries for common access patterns
- Document synchronization mechanisms and concurrency assumptions

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
- Keep related functionality together; split only when clear boundaries emerge

## Testing

- Write unit tests for all new functionality
- Ensure tests are deterministic and don't have race conditions
- Consider adding integration tests for complex features
- Mock external dependencies appropriately in tests
- Include meaningful diagnostic data in test logs to help debug failures
- Test edge cases and error paths, not just the happy path
- Value the ability to debug rare failures through logging

## Documentation

- Update relevant documentation when changing functionality
- Add clear docstrings to public functions and types
- Include examples where appropriate
- Update changelog entries for significant changes
- Document assumptions and non-obvious behaviors

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