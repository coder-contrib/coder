# List(string) Parameter Examples

This template demonstrates various styling and usage patterns for `list(string)` parameters in Coder templates.

## Examples Included

1. **Basic list(string) parameter** - A simple multi-select with default values
2. **Tag-select form type** - Uses the tag-select UI style for a more tag-focused interface
3. **Multi-select form type** - Explicitly sets the multi-select form type with custom icons per option
4. **Custom icons with no defaults** - Shows how to create a parameter with no default selections
5. **Many options** - Demonstrates how the UI handles a larger number of options
6. **Ephemeral parameters** - For operations that only need to apply during startup/update
7. **Dynamically generated options** - Shows how to generate options using Terraform locals

## Usage

This template is designed to work with Docker. To use it:

1. Create a new template in Coder pointing to this directory
2. Create a new workspace using the template
3. Experiment with the different parameter types

## Working with list(string) Values

The examples also show how to:

- Set default values using `jsonencode()`
- Access selected values using `jsondecode()`
- Display values in workspace metadata
- Generate dynamic options

## Command Line Usage

When using `list(string)` parameters on the command line, you need to be careful with quoting:

```bash
coder create --parameter "\"security_groups=[\"\"web-sg\"\",\"\"db-sg\"\"]\""
```

Alternatively, use a parameter file for a cleaner approach:

```yaml
# params.yaml
security_groups:
  - web-sg
  - db-sg
```

```bash
coder create --rich-parameter-file params.yaml
```

## Parameter UI Rendering

The multi-select control in Coder renders differently based on:

- The number of options (scrollable when many options exist)
- Whether `form_type` is set to `multi-select` or `tag-select`
- Whether icons are provided for options
- The presence of descriptions for each option