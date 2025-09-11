package cli

import (
	"os"
	"os/exec"
)

// getCoderBinaryPath returns the path to the coder binary, prioritizing CODER_SSH_CONFIG_BINARY_PATH
// if set, otherwise falling back to just "coder"
func getCoderBinaryPath() string {
	if binaryPath := os.Getenv("CODER_SSH_CONFIG_BINARY_PATH"); binaryPath != "" {
		return binaryPath
	}
	
	// Try to find the coder binary in PATH
	path, err := exec.LookPath("coder")
	if err == nil {
		return path
	}
	
	// Fall back to just "coder" if we can't find it
	return "coder"
}

// getCoderURL returns the Coder URL to use for login, using CODER_URL if set
func getCoderURL() string {
	if url := os.Getenv("CODER_URL"); url != "" {
		return url
	}
	return "<url>"
}