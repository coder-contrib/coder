import { render, screen } from "@testing-library/react";
import type { WorkspaceAgent } from "api/typesGenerated";
import { AgentStatus } from "./AgentStatus";

describe("AgentStatus", () => {
  it("renders a ready status", () => {
    const agent = {
      status: "connected",
      lifecycle_state: "ready",
      scripts: [],
      troubleshooting_url: "https://coder.com/troubleshoot",
    } as WorkspaceAgent;
    render(<AgentStatus agent={agent} />);
    expect(screen.getByLabelText("Ready")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("renders a disconnected status", () => {
    const agent = {
      status: "disconnected",
      scripts: [],
      troubleshooting_url: "https://coder.com/troubleshoot",
    } as WorkspaceAgent;
    render(<AgentStatus agent={agent} />);
    expect(screen.getByLabelText("Disconnected")).toBeInTheDocument();
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  it("renders a connecting status", () => {
    const agent = {
      status: "connecting",
      scripts: [],
      troubleshooting_url: "https://coder.com/troubleshoot",
    } as WorkspaceAgent;
    render(<AgentStatus agent={agent} />);
    expect(screen.getByLabelText("Connecting...")).toBeInTheDocument();
    expect(screen.getByText("Connecting...")).toBeInTheDocument();
  });

  it("renders a timeout status", () => {
    const agent = {
      status: "timeout",
      scripts: [],
      troubleshooting_url: "https://coder.com/troubleshoot",
    } as WorkspaceAgent;
    render(<AgentStatus agent={agent} />);
    expect(screen.getByLabelText("Timeout")).toBeInTheDocument();
    expect(screen.getByText("Agent is taking too long to connect")).toBeInTheDocument();
    expect(screen.getByText("Troubleshoot")).toHaveAttribute("href", "https://coder.com/troubleshoot");
  });

  it("renders a start error status", () => {
    const agent = {
      status: "connected",
      lifecycle_state: "start_error",
      scripts: [],
      troubleshooting_url: "https://coder.com/troubleshoot",
    } as WorkspaceAgent;
    render(<AgentStatus agent={agent} />);
    expect(screen.getByLabelText("Start error")).toBeInTheDocument();
    expect(screen.getByText("Error starting the agent")).toBeInTheDocument();
    expect(screen.getByText("Troubleshoot")).toHaveAttribute("href", "https://coder.com/troubleshoot");
  });
});