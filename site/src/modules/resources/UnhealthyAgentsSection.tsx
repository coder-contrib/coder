import { type FC } from "react";
import { AgentStatus } from "./AgentStatus";
import type { WorkspaceAgent } from "api/typesGenerated";
import { Stack } from "components/Stack/Stack";
import { Alert, AlertTitle } from "@mui/material";

interface UnhealthyAgentsSectionProps {
  agents: WorkspaceAgent[];
}

export const UnhealthyAgentsSection: FC<UnhealthyAgentsSectionProps> = ({ agents }) => {
  const unhealthyAgents = agents.filter(
    (agent) => agent.status !== "connected" || agent.lifecycle_state !== "ready"
  );

  if (unhealthyAgents.length === 0) {
    return null;
  }

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <AlertTitle>Unhealthy Agents Detected</AlertTitle>
      <Stack spacing={1}>
        {unhealthyAgents.map((agent) => (
          <div key={agent.id}>
            <AgentStatus agent={agent} />
            <span>{agent.name}</span>
          </div>
        ))}
      </Stack>
    </Alert>
  );
};