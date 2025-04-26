terraform {
  required_providers {
    coder = {
      source = "coder/coder"
    }
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

locals {
  username = data.coder_workspace_owner.me.name
}

data "coder_provisioner" "me" {
}

provider "docker" {
}

data "coder_workspace" "me" {
}
data "coder_workspace_owner" "me" {}

resource "coder_agent" "main" {
  arch           = data.coder_provisioner.me.arch
  os             = "linux"
  startup_script = <<-EOT
    set -e

    # Install the latest code-server.
    # Append "--version x.x.x" to install a specific version of code-server.
    curl -fsSL https://code-server.dev/install.sh | sh -s -- --method=standalone --prefix=/tmp/code-server

    # Start code-server in the background.
    /tmp/code-server/bin/code-server --auth none --port 13337 >/tmp/code-server.log 2>&1 &
  EOT
}

resource "coder_app" "code-server" {
  agent_id     = coder_agent.main.id
  slug         = "code-server"
  display_name = "code-server"
  url          = "http://localhost:13337/?folder=/home/${local.username}"
  icon         = "/icon/code.svg"
  subdomain    = false
  share        = "owner"

  healthcheck {
    url       = "http://localhost:13337/healthz"
    interval  = 5
    threshold = 6
  }
}

resource "docker_volume" "home_volume" {
  name = "coder-${data.coder_workspace.me.id}-home"
  # Protect the volume from being deleted due to changes in attributes.
  lifecycle {
    ignore_changes = all
  }
  # Add labels in Docker to keep track of orphan resources.
  labels {
    label = "coder.owner"
    value = data.coder_workspace_owner.me.name
  }
  labels {
    label = "coder.owner_id"
    value = data.coder_workspace_owner.me.id
  }
  labels {
    label = "coder.workspace_id"
    value = data.coder_workspace.me.id
  }
  # This field becomes outdated if the workspace is renamed but can
  # be useful for debugging or cleaning out dangling volumes.
  labels {
    label = "coder.workspace_name_at_creation"
    value = data.coder_workspace.me.name
  }
}

resource "docker_image" "main" {
  name = "coder-${data.coder_workspace.me.id}"
  build {
    context = "./build"
    build_args = {
      USER = local.username
    }
  }
  triggers = {
    dir_sha1 = sha1(join("", [for f in fileset(path.module, "build/*") : filesha1(f)]))
  }
  keep_locally = true
}

resource "docker_container" "workspace" {
  count = data.coder_workspace.me.start_count
  image = docker_image.main.name
  # Uses lower() to avoid Docker restriction on container names.
  name = "coder-${data.coder_workspace_owner.me.name}-${lower(data.coder_workspace.me.name)}"
  # Hostname makes the shell more user friendly: coder@my-workspace:~$
  hostname = data.coder_workspace.me.name
  # Use the docker gateway if the access URL is 127.0.0.1
  entrypoint = ["sh", "-c", replace(coder_agent.main.init_script, "/localhost|127\\.0\\.0\\.1/", "host.docker.internal")]
  env        = ["CODER_AGENT_TOKEN=${coder_agent.main.token}"]
  host {
    host = "host.docker.internal"
    ip   = "host-gateway"
  }
  volumes {
    container_path = "/home/${local.username}"
    volume_name    = docker_volume.home_volume.name
    read_only      = false
  }
  # Add labels in Docker to keep track of orphan resources.
  labels {
    label = "coder.owner"
    value = data.coder_workspace_owner.me.name
  }
  labels {
    label = "coder.owner_id"
    value = data.coder_workspace_owner.me.id
  }
  labels {
    label = "coder.workspace_id"
    value = data.coder_workspace.me.id
  }
  labels {
    label = "coder.workspace_name"
    value = data.coder_workspace.me.name
  }
}

// Rich list(string) parameter examples
// The following examples demonstrate different styling and configuration options
// for list(string) parameters in Coder templates.

// EXAMPLE 1: Basic list(string) parameter 
// This is a simple list(string) parameter with no styling customizations.
// It will render as a standard multi-select field.
data "coder_parameter" "basic_tags" {
  name         = "basic_tags"
  display_name = "Basic Tags"
  description  = "Select one or more tags to apply to your workspace resources"
  type         = "list(string)"
  default      = jsonencode(["development", "testing"])
  mutable      = true
  order        = 1
}

// EXAMPLE 2: List(string) with custom form type (tag-select)
// The tag-select form type changes the visual appearance to a more tag-focused UI
// This is useful when the options represent tags or labels
data "coder_parameter" "tag_select" {
  name         = "tag_select" 
  display_name = "Tag Selection"
  description  = "Select tags using the tag-select UI style"
  type         = "list(string)"
  default      = jsonencode(["frontend", "backend", "database"])
  mutable      = true
  form_type    = "tag-select"
  order        = 2
}

// EXAMPLE 3: List(string) with custom form type (multi-select)
// The multi-select form type is the default but can be explicitly set
// It provides a standard multi-select dropdown UI
data "coder_parameter" "multi_select" {
  name         = "multi_select"
  display_name = "Multi-Select Example"
  description  = "Multi-select dropdown with predefined options"
  type         = "list(string)"
  default      = jsonencode(["small", "medium"])
  mutable      = true
  form_type    = "multi-select"
  icon         = "/emojis/1f3c6.png"
  order        = 3
  
  option {
    name  = "Small Configuration"
    value = "small"
    icon  = "/emojis/1f42d.png"
  }
  option {
    name  = "Medium Configuration"
    value = "medium"
    icon  = "/emojis/1f98a.png"
  }
  option {
    name  = "Large Configuration"
    value = "large"
    icon  = "/emojis/1f406.png"
  }
}

// EXAMPLE 4: List(string) with custom icon and no default values
// This example demonstrates how to create a parameter with no default selection
// Users must select at least one option (assuming the template uses this parameter)
data "coder_parameter" "security_groups" {
  name         = "security_groups"
  display_name = "Security Groups"
  description  = "Select security groups to apply to your workspace"
  type         = "list(string)"
  icon         = "/emojis/1f510.png"
  mutable      = true
  
  // Empty array as default means no values selected initially
  default      = jsonencode([])
  
  option {
    name        = "Web Security Group"
    value       = "web-sg"
    icon        = "/emojis/1f310.png"
    description = "Security group for web server access"
  }
  option {
    name        = "Database Security Group"
    value       = "db-sg"
    icon        = "/emojis/1f4be.png"
    description = "Security group for database access"
  }
  option {
    name        = "SSH Security Group"
    value       = "ssh-sg"
    icon        = "/emojis/1f512.png"
    description = "Security group for SSH access"
  }
  order        = 4
}

// EXAMPLE 5: List(string) with many options
// This demonstrates how the UI handles a larger number of options
// The multi-select field becomes scrollable when there are many options
data "coder_parameter" "programming_languages" {
  name         = "programming_languages"
  display_name = "Programming Languages"
  description  = "Select languages you'll work with in this workspace"
  type         = "list(string)"
  default      = jsonencode(["javascript", "python"])
  mutable      = true
  icon         = "/emojis/1f4bb.png"
  order        = 5
  
  option {
    name        = "JavaScript"
    value       = "javascript"
    icon        = "/emojis/1f41b.png"
  }
  option {
    name        = "Python"
    value       = "python"
    icon        = "/emojis/1f40d.png"
  }
  option {
    name        = "Go"
    value       = "golang"
    icon        = "/emojis/1f4a7.png"
  }
  option {
    name        = "Rust"
    value       = "rust"
    icon        = "/emojis/1f529.png"
  }
  option {
    name        = "Java"
    value       = "java"
    icon        = "/emojis/2615.png"
  }
  option {
    name        = "C++"
    value       = "cpp"
    icon        = "/emojis/1f4a5.png"
  }
  option {
    name        = "C#"
    value       = "csharp"
    icon        = "/emojis/1f3b5.png"
  }
  option {
    name        = "Ruby"
    value       = "ruby"
    icon        = "/emojis/1f48e.png"
  }
  option {
    name        = "PHP"
    value       = "php"
    icon        = "/emojis/1f418.png"
  }
  option {
    name        = "Swift"
    value       = "swift"
    icon        = "/emojis/1f54a.png"
  }
}

// EXAMPLE 6: Ephemeral list(string) parameter
// This is useful for operations that only need to be applied during 
// workspace creation or update but shouldn't be persisted
data "coder_parameter" "setup_tasks" {
  name         = "setup_tasks"
  display_name = "Setup Tasks"
  description  = "Select initialization tasks to run on startup"
  type         = "list(string)"
  default      = jsonencode(["update_packages", "install_dependencies"])
  mutable      = true
  ephemeral    = true
  icon         = "/emojis/1f680.png"
  order        = 6
  
  option {
    name        = "Update System Packages"
    value       = "update_packages"
    description = "Run system package updates on startup"
  }
  option {
    name        = "Install Dependencies"
    value       = "install_dependencies"
    description = "Install project dependencies"
  }
  option {
    name        = "Run Database Migrations"
    value       = "run_migrations"
    description = "Execute database migration scripts"
  }
  option {
    name        = "Seed Test Data"
    value       = "seed_test_data"
    description = "Populate database with test data"
  }
}

// EXAMPLE 7: Dynamically generated options for list(string)
// This example shows how to generate options dynamically using Terraform locals
locals {
  environment_options = {
    "dev" = {
      name        = "Development"
      description = "Development environment with debugging tools"
      icon        = "/emojis/1f3ed.png"
    }
    "staging" = {
      name        = "Staging"
      description = "Pre-production environment for testing"
      icon        = "/emojis/1f6a7.png"
    }
    "prod" = {
      name        = "Production"
      description = "Production-grade environment"
      icon        = "/emojis/1f6eb.png"
    }
    "qa" = {
      name        = "Quality Assurance"
      description = "Environment for quality testing"
      icon        = "/emojis/1f9ea.png"
    }
  }
}

data "coder_parameter" "environments" {
  name         = "environments"
  display_name = "Deployment Environments"
  description  = "Select which environments this workspace can deploy to"
  type         = "list(string)"
  default      = jsonencode(["dev"])
  mutable      = true
  icon         = "/emojis/1f30e.png"
  order        = 7
  
  // Dynamically create an option for each environment defined in locals
  dynamic "option" {
    for_each = local.environment_options
    content {
      name        = option.value.name
      value       = option.key
      description = option.value.description
      icon        = option.value.icon
    }
  }
}

// Example of accessing list(string) parameter values in Terraform:

resource "coder_metadata" "workspace_info" {
  resource_id  = docker_container.workspace[0].id
  hide_details = false
  
  item {
    key   = "Tags"
    value = join(", ", jsondecode(data.coder_parameter.basic_tags.value))
  }
  
  item {
    key   = "Security Groups"
    value = join(", ", jsondecode(data.coder_parameter.security_groups.value))
  }
  
  item {
    key   = "Programming Languages"
    value = join(", ", jsondecode(data.coder_parameter.programming_languages.value))
  }
}

// NOTE: For real-world usage of these parameters, you would typically:
// 1. Pass them to infrastructure providers (AWS, GCP, Azure, etc.)
// 2. Use them to customize workspace configurations
// 3. Include them in resource tags or metadata
// 4. Control conditional resource creation based on selections