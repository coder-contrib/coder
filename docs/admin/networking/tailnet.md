---
title: "Tailnet"
description: "Learn about Coder's tailnet architecture for secure workspace connectivity."
---

# Tailnet

Tailnet is the secure networking system used by Coder to establish connectivity between clients and workspace agents. The system is built on Tailscale's Wireguard implementation and provides a robust, secure, and efficient networking layer.

## Architecture Overview

Coder's tailnet architecture consists of several key components:

![Tailnet Architecture](../../images/tailnet-architecture.png)

### Coordinator

The Coordinator is a central component responsible for exchanging connection information between peers:

- Manages peer discovery and connection establishment
- Tracks node information and tunnel mappings
- Facilitates connections between clients and workspace agents
- Handles authentication and authorization of connection attempts

### DERP (Designated Encapsulated Routing Protocol) Servers

DERP servers act as relay servers for connections that cannot be established directly:

- Enable connectivity when direct peer-to-peer connections aren't possible due to NATs or firewalls
- Support both embedded and public DERP servers
- Fall back to WebSockets when needed for compatibility with certain network environments

### Connection Process

The connection process follows these steps:

1. Clients and agents connect to the Coordinator with their authentication credentials
2. Node information is exchanged via the Coordinator
3. Direct peer-to-peer connection is attempted first using discovery protocols
4. If direct connection fails, traffic is routed through DERP relay servers

### Authentication & Authorization

Tailnet implements several authentication mechanisms:

- **SingleTailnetCoordinateeAuth**: Used by Coderd and workspace proxies to initiate tunnels to any agent
- **ClientCoordinateeAuth**: Restricts connections to a specific agent
- **AgentCoordinateeAuth**: Prevents agents from initiating tunnels (they can only accept connections)
- **ClientUserCoordinateeAuth**: Uses a TunnelAuthorizer to check if a user is authorized to connect to an agent

### Network Components

Tailnet uses several key network components:

- **Wireguard**: Used for encrypted transport
- **Virtualized Networking**: Implemented in userspace for cross-platform compatibility
- **IPv6 Addressing**: Uses custom IPv6 address prefixes to avoid conflicts
- **Connection Telemetry**: Monitors connection health and performance

## Configuration Options

Coder allows configuration of tailnet through several settings:

### DERP Configuration

- **Custom DERP Maps**: Specify custom DERP servers for better performance or compliance
- **DERP Regions**: Configure regional DERP servers for lower latency
- **STUN Configuration**: Enable/disable STUN for NAT traversal

### Connection Preferences

- **P2P Endpoints**: Can be blocked to force all connections through DERP servers
- **WebSockets**: Can be forced for compatibility with certain proxies or firewalls

## Troubleshooting

Common tailnet issues and their solutions:

### Connection Problems

- **Connection Refused**: Check firewall rules and ensure DERP servers are accessible
- **High Latency**: May indicate routing through DERP instead of direct P2P
- **Connection Drops**: Could be related to NAT timeouts or network changes

### Diagnostics

Tools for diagnosing tailnet issues:

- **Network Check**: Use `coder netcheck` to diagnose connectivity issues
- **Connection Status**: View connection status in the workspace details page
- **Logs**: Check logs for connection issues and DERP routing information

## Security Considerations

Tailnet provides several security features:

- **End-to-End Encryption**: All traffic is encrypted using Wireguard
- **Authorization Controls**: Fine-grained control over who can connect to which workspaces
- **Network Isolation**: Each workspace has its own isolated network

## Performance Optimization

Tips for optimizing tailnet performance:

- Deploy DERP servers close to your users and workspaces for better latency
- Ensure STUN is properly configured to enable direct connections when possible
- Consider network topology when deploying Coder in multi-region setups