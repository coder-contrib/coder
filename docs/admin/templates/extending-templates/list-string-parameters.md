# Working with list(string) Parameters

This guide explores the usage of `list(string)` parameters in Coder templates, providing examples and best practices for their implementation.

## Introduction to list(string) Parameters

The `list(string)` parameter type allows users to select multiple string values from a predefined set of options. This is useful for scenarios where multiple selections are needed, such as:

- Selecting multiple security groups
- Choosing programming languages or tools
- Applying tags to resources
- Selecting features to enable

## Basic Usage

To define a basic `list(string)` parameter:

```tf
data "coder_parameter" "security_groups" {
  name         = "security_groups"
  display_name = "Security Groups"
  description  = "Select security groups to apply to your workspace"
  type         = "list(string)"
  default      = jsonencode(["default-sg", "ssh-sg"])
  mutable      = true
}
```

Key points:
- Use the `jsonencode()` function to specify default values
- The default values must be a JSON array of strings
- Users can select zero, one, or multiple values

## UI Rendering Options

### Form Types

Coder supports two main form types for `list(string)` parameters:

#### 1. Multi-select (default)

The standard multi-select dropdown:

```tf
data "coder_parameter" "languages" {
  name         = "languages"
  display_name = "Programming Languages"
  description  = "Select languages you'll work with"
  type         = "list(string)"
  default      = jsonencode(["python", "javascript"])
  form_type    = "multi-select"  # This is the default
}
```

#### 2. Tag-select

A more tag-focused interface, useful for parameters representing tags or labels:

```tf
data "coder_parameter" "tags" {
  name         = "tags"
  display_name = "Resource Tags"
  description  = "Tags to apply to your workspace resources"
  type         = "list(string)"
  default      = jsonencode(["development", "testing"])
  form_type    = "tag-select"
}
```

### Adding Icons and Descriptions

You can enhance the UI by adding icons and descriptions to both the parameter and individual options:

```tf
data "coder_parameter" "environments" {
  name         = "environments"
  display_name = "Deployment Environments"
  description  = "Select which environments this workspace can deploy to"
  type         = "list(string)"
  default      = jsonencode(["dev"])
  icon         = "/emojis/1f30e.png"
  
  option {
    name        = "Development"
    value       = "dev"
    icon        = "/emojis/1f3ed.png"
    description = "Development environment with debugging tools"
  }
  
  option {
    name        = "Production"
    value       = "prod"
    icon        = "/emojis/1f6eb.png"
    description = "Production-grade environment"
  }
}
```

## Working with Selected Values

To use the selected values in your template:

```tf
resource "aws_instance" "workspace" {
  // Other configuration...
  
  // Use jsondecode() to convert the JSON string back to a list
  security_groups = jsondecode(data.coder_parameter.security_groups.value)
}
```

For displaying in metadata:

```tf
resource "coder_metadata" "workspace_info" {
  resource_id = aws_instance.workspace.id
  
  item {
    key   = "Environments"
    value = join(", ", jsondecode(data.coder_parameter.environments.value))
  }
}
```

## Dynamic Options

You can dynamically generate options for a `list(string)` parameter:

```tf
locals {
  available_regions = {
    "us-east-1" = {
      name = "US East (N. Virginia)",
      icon = "/emojis/1f1fa-1f1f8.png"
    },
    "eu-west-1" = {
      name = "EU West (Ireland)",
      icon = "/emojis/1f1ea-1f1fa.png"
    }
    // Additional regions...
  }
}

data "coder_parameter" "regions" {
  name         = "regions"
  display_name = "AWS Regions"
  description  = "Select AWS regions to deploy to"
  type         = "list(string)"
  default      = jsonencode(["us-east-1"])
  
  dynamic "option" {
    for_each = local.available_regions
    content {
      name  = option.value.name
      value = option.key
      icon  = option.value.icon
    }
  }
}
```

## Empty Defaults

To create a parameter with no default selections:

```tf
data "coder_parameter" "features" {
  name         = "features"
  display_name = "Optional Features"
  description  = "Select optional features to enable"
  type         = "list(string)"
  default      = jsonencode([])  // Empty array means no default selection
}
```

## Ephemeral List Parameters

For operations that should only apply during workspace creation or updates:

```tf
data "coder_parameter" "startup_tasks" {
  name         = "startup_tasks"
  display_name = "Startup Tasks"
  description  = "Tasks to run during workspace startup"
  type         = "list(string)"
  default      = jsonencode(["update_packages"])
  ephemeral    = true
  
  option {
    name  = "Update Packages"
    value = "update_packages"
  }
  option {
    name  = "Run Migrations"
    value = "run_migrations"
  }
}
```

## Command Line Usage

Using `list(string)` parameters on the command line requires careful quoting:

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

## Best Practices

1. **Provide Clear Descriptions**: Ensure each option has a clear description
2. **Use Appropriate Icons**: Visual cues help users quickly identify options
3. **Group Related Parameters**: Keep related parameters together using the `order` attribute
4. **Consider Default Selections**: Choose sensible defaults to minimize user effort
5. **Use Form Types Appropriately**: Use `tag-select` for tags, `multi-select` for other selections
6. **Limit Option Count**: Avoid overwhelming users with too many options
7. **Use Dynamic Options**: Generate options programmatically when the list might change

## Full Example

See the [list-string-parameters example template](https://github.com/coder/coder/tree/main/examples/parameters-list-string) for a complete implementation showcasing various styling and configuration options.

```tf
data "coder_parameter" "environments" {
  name         = "environments"
  display_name = "Deployment Environments"
  description  = "Select which environments this workspace can deploy to"
  type         = "list(string)"
  default      = jsonencode(["dev"])
  mutable      = true
  icon         = "/emojis/1f30e.png"
  form_type    = "multi-select"
  
  option {
    name        = "Development"
    value       = "dev"
    icon        = "/emojis/1f3ed.png"
    description = "Development environment with debugging tools"
  }
  
  option {
    name        = "Staging"
    value       = "staging"
    icon        = "/emojis/1f6a7.png"
    description = "Pre-production environment for testing"
  }
  
  option {
    name        = "Production"
    value       = "prod"
    icon        = "/emojis/1f6eb.png"
    description = "Production-grade environment"
  }
}
```