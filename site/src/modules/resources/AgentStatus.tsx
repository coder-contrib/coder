import type { Interpolation, Theme } from "@emotion/react";
import WarningRounded from "@mui/icons-material/WarningRounded";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import type { WorkspaceAgent } from "api/typesGenerated";
import { ChooseOne, Cond } from "components/Conditionals/ChooseOne";
import {
	HelpTooltip,
	HelpTooltipContent,
	HelpTooltipText,
	HelpTooltipTitle,
} from "components/HelpTooltip/HelpTooltip";
import { PopoverTrigger } from "components/deprecated/Popover/Popover";
import type { FC } from "react";

// If we think in the agent status and lifecycle into a single enum/state I’d
// say we would have: connecting, timeout, disconnected, connected:created,
// connected:starting, connected:start_timeout, connected:start_error,
// connected:ready, connected:shutting_down, connected:shutdown_timeout,
// connected:shutdown_error, connected:off.

const ReadyLifecycle: FC = () => {
	return (
		<div
			role="status"
			data-testid="agent-status-ready"
			aria-label="Ready"
			css={[styles.status, styles.connected]}
		/>
	);
};

const StartingLifecycle: FC = () => {
	return (
		<div role="status" aria-label="Starting..." css={[styles.status, styles.connecting]} />
	);
};

interface AgentStatusProps {
	agent: WorkspaceAgent;
}

const StartTimeoutLifecycle: FC<AgentStatusProps> = ({ agent }) => {
	return (
		<div css={styles.statusError}>
			<WarningRounded css={styles.timeoutWarning} />
			<Link
				target="_blank"
				rel="noreferrer"
				href={agent.troubleshooting_url}
				css={styles.troubleshootLink}
			>
				Troubleshoot
			</Link>
		</div>
	);
};

const StartErrorLifecycle: FC<AgentStatusProps> = ({ agent }) => {
	return (
		<div css={styles.statusError}>
			<WarningRounded css={styles.errorWarning} />
			<Link
				target="_blank"
				rel="noreferrer"
				href={agent.troubleshooting_url}
				css={styles.troubleshootLink}
			>
				Troubleshoot
			</Link>
		</div>
	);
};

const ShuttingDownLifecycle: FC = () => {
	return (
		<Tooltip title="Stopping...">
			<div
				role="status"
				aria-label="Stopping..."
				css={[styles.status, styles.connecting]}
			/>
		</Tooltip>
	);
};

const ShutdownTimeoutLifecycle: FC<AgentStatusProps> = ({ agent }) => {
	return (
		<div css={styles.statusError}>
			<WarningRounded css={styles.timeoutWarning} />
			<Link
				target="_blank"
				rel="noreferrer"
				href={agent.troubleshooting_url}
				css={styles.troubleshootLink}
			>
				Troubleshoot
			</Link>
		</div>
	);
};

const ShutdownErrorLifecycle: FC<AgentStatusProps> = ({ agent }) => {
	return (
		<div css={styles.statusError}>
			<WarningRounded css={styles.errorWarning} />
			<Link
				target="_blank"
				rel="noreferrer"
				href={agent.troubleshooting_url}
				css={styles.troubleshootLink}
			>
				Troubleshoot
			</Link>
		</div>
	);
};

const OffLifecycle: FC = () => {
	return (
		<div
			role="status"
			aria-label="Stopped"
			css={[styles.status, styles.disconnected]}
		/>
	);
};

const ConnectedStatus: FC<AgentStatusProps> = ({ agent }) => {
	// This is to support legacy agents that do not support
	// reporting the lifecycle_state field.
	if (agent.scripts.length === 0) {
		return <ReadyLifecycle />;
	}
	return (
		<ChooseOne>
			<Cond condition={agent.lifecycle_state === "ready"}>
				<ReadyLifecycle />
			</Cond>
			<Cond condition={agent.lifecycle_state === "start_timeout"}>
				<StartTimeoutLifecycle agent={agent} />
			</Cond>
			<Cond condition={agent.lifecycle_state === "start_error"}>
				<StartErrorLifecycle agent={agent} />
			</Cond>
			<Cond condition={agent.lifecycle_state === "shutting_down"}>
				<ShuttingDownLifecycle />
			</Cond>
			<Cond condition={agent.lifecycle_state === "shutdown_timeout"}>
				<ShutdownTimeoutLifecycle agent={agent} />
			</Cond>
			<Cond condition={agent.lifecycle_state === "shutdown_error"}>
				<ShutdownErrorLifecycle agent={agent} />
			</Cond>
			<Cond condition={agent.lifecycle_state === "off"}>
				<OffLifecycle />
			</Cond>
			<Cond>
				<StartingLifecycle />
			</Cond>
		</ChooseOne>
	);
};

const DisconnectedStatus: FC = () => {
	return (
		<div
			role="status"
			aria-label="Disconnected"
			css={[styles.status, styles.disconnected]}
		/>
	);
};

const ConnectingStatus: FC = () => {
	return (
		<div
			role="status"
			aria-label="Connecting..."
			css={[styles.status, styles.connecting]}
		/>
	);
};

const TimeoutStatus: FC<AgentStatusProps> = ({ agent }) => {
	return (
		<div css={styles.statusError}>
			<WarningRounded css={styles.timeoutWarning} />
		</div>
	);
};

export const AgentStatus: FC<AgentStatusProps> = ({ agent }) => {
	const statusText = getStatusText(agent);
	const showTroubleshooting = 
		agent.status === "timeout" || 
		(agent.status === "connected" && (
			agent.lifecycle_state === "start_timeout" || 
			agent.lifecycle_state === "start_error" || 
			agent.lifecycle_state === "shutdown_timeout" || 
			agent.lifecycle_state === "shutdown_error"
		));

	return (
		<div css={styles.statusContainer}>
			<ChooseOne>
				<Cond condition={agent.status === "connected"}>
					<ConnectedStatus agent={agent} />
				</Cond>
				<Cond condition={agent.status === "disconnected"}>
					<DisconnectedStatus />
				</Cond>
				<Cond condition={agent.status === "timeout"}>
					<TimeoutStatus agent={agent} />
				</Cond>
				<Cond>
					<ConnectingStatus />
				</Cond>
			</ChooseOne>
			<span css={styles.statusText}>{statusText}</span>
			{showTroubleshooting && (
				<Link
					target="_blank"
					rel="noreferrer"
					href={agent.troubleshooting_url}
					css={styles.troubleshootLink}
				>
					Troubleshoot
				</Link>
			)}
		</div>
	);
};

const getStatusText = (agent: WorkspaceAgent): string => {
	switch (agent.status) {
		case "connected":
			switch (agent.lifecycle_state) {
				case "ready":
					return "Ready";
				case "starting":
					return "Starting...";
				case "start_timeout":
					return "Start timeout";
				case "start_error":
					return "Start error";
				case "shutting_down":
					return "Shutting down...";
				case "shutdown_timeout":
					return "Shutdown timeout";
				case "shutdown_error":
					return "Shutdown error";
				case "off":
					return "Stopped";
				default:
					return "Starting...";
			}
		case "disconnected":
			return "Disconnected";
		case "timeout":
			return "Connection timeout";
		default:
			return "Connecting...";
	}
};

const styles = {
	statusContainer: {
		display: "flex",
		alignItems: "center",
		gap: 8,
	},
	status: {
		width: 6,
		height: 6,
		borderRadius: "100%",
		flexShrink: 0,
	},
	statusText: (theme) => ({
		fontSize: 14,
		color: theme.palette.text.secondary,
	}),
	statusError: {
		display: "flex",
		alignItems: "center",
		gap: 4,
	},
	troubleshootLink: (theme) => ({
		fontSize: 12,
		color: theme.palette.primary.main,
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline",
		},
	}),

	connected: (theme) => ({
		backgroundColor: theme.palette.success.light,
		boxShadow: `0 0 12px 0 ${theme.palette.success.light}`,
	}),

	disconnected: (theme) => ({
		backgroundColor: theme.palette.text.secondary,
	}),

	"@keyframes pulse": {
		"0%": {
			opacity: 1,
		},
		"50%": {
			opacity: 0.4,
		},
		"100%": {
			opacity: 1,
		},
	},

	connecting: (theme) => ({
		backgroundColor: theme.palette.info.light,
		animation: "$pulse 1.5s 0.5s ease-in-out forwards infinite",
	}),

	timeoutWarning: (theme) => ({
		color: theme.palette.warning.light,
		width: 14,
		height: 14,
		position: "relative",
	}),

	errorWarning: (theme) => ({
		color: theme.palette.error.main,
		width: 14,
		height: 14,
		position: "relative",
	}),
} satisfies Record<string, Interpolation<Theme>>;
