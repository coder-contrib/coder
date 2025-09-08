import { render, screen } from "@testing-library/react";
import { UnhealthyAgentsSection } from "./UnhealthyAgentsSection";
import type { WorkspaceAgent } from "api/typesGenerated";

describe("UnhealthyAgentsSection", () => {
  const mockAgent: WorkspaceAgent = {
    id: "test-agent",
    name: "test-agent",
    status: "connecting",
    lifecycle_state: "starting",
    display_apps: [],
    architecture: "amd64",
    operating_system: "linux",
    apps: [],
    created_at: "",
    scripts: [],
    troubleshooting_url: "https://coder.com/troubleshoot",
  };

  it("renders nothing when all agents are healthy", () => {
    const { container } = render(<UnhealthyAgentsSection agents={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders unhealthy agents section when unhealthy agents exist", () => {
    render(<UnhealthyAgentsSection agents={[mockAgent]} />);
    expect(screen.getByText("Unhealthy Agents Detected")).toBeInTheDocument();
    expect(screen.getByText("test-agent")).toBeInTheDocument();
  });

  it("filters out healthy agents", () => {
    const healthyAgent = {
      ...mockAgent,
      id: "healthy-agent",
      name: "healthy-agent",
      status: "connected",
      lifecycle_state: "ready",
    };

    render(
      <UnhealthyAgentsSection agents={[mockAgent, healthyAgent]} />,
    );

    expect(screen.getByText("test-agent")).toBeInTheDocument();
    expect(screen.queryByText("healthy-agent")).not.toBeInTheDocument();
  });
});