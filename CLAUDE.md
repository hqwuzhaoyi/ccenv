# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ccenv is a CLI tool for managing Claude Code environment variables (`ANTHROPIC_BASE_URL` and `ANTHROPIC_API_KEY`). It allows users to define multiple environment configurations and switch between them seamlessly, with optional shell integration for automatic environment variable application.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development mode (run TypeScript directly)
pnpm dev <command> [args]
# Example: pnpm dev add test

# Build TypeScript to JavaScript
pnpm build

# Test built CLI
node dist/index.js --help
node dist/index.js <command>

# Package manager
# Uses pnpm (specified in package.json)
```

## Architecture

### Core Components

**CLI Entry Point** (`src/index.ts`)
- Uses Commander.js for CLI argument parsing
- Defines all available commands and their options
- Each command delegates to a specific handler in `src/commands/`

**Commands** (`src/commands/`)
- `add.ts` - Interactive environment creation using Inquirer.js
- `list.ts` - Display all configured environments with current indicator
- `use.ts` - Switch environments with optional `--source` flag for shell integration
- `current.ts` - Show/export current environment with optional `--export` flag
- `install.ts` - Shell integration installer (adds 2 lines to .zshrc/.bashrc)
- `init.ts` - Environment initialization with `--shell` flag for dynamic script generation

**Configuration Management** (`src/config/manager.ts`)
- Handles all file I/O operations for configuration storage
- Manages three key files:
  - `~/.ccenv/config.json` - Main configuration with all environments
  - `~/.ccenv/current_env` - Persistent current environment name
  - `.ccenv` - Project-level environment file
- Functions for CRUD operations on environments and persistence

**Data Types** (`src/types.ts`)
- `Environment` interface: name, anthropicBaseUrl, anthropicApiKey, isActive
- `Config` interface: environments array, currentEnvironment string

### Shell Integration Design

The tool follows a volta/bun-style integration pattern:

**Installation adds only 2 lines to shell config:**
```bash
export CCENV_HOME="$HOME/.ccenv"
eval "$(ccenv init --shell)"
```

**Dynamic Script Generation:**
- `ccenv init --shell` outputs the complete shell integration script
- `ccenv init` (no --shell) outputs current environment variables
- Shell integration includes:
  - Wrapper function that intercepts `ccenv use` commands
  - Directory change hooks for `.ccenv` file detection
  - Auto-loading of persistent environment on shell start

### Two-Mode Operation

**Manual Mode:**
- `ccenv use work` displays instructions
- User manually runs `eval "$(ccenv current --export)"`

**Shell Integration Mode:**
- `ccenv use work` automatically applies environment variables
- New terminals auto-restore last environment
- Directory changes trigger `.ccenv` file detection

### Configuration Storage

**Environment Persistence:**
- `setCurrentEnvironment()` updates both config.json and current_env file
- Shell integration reads current_env for faster startup
- Project-level `.ccenv` files override global current environment

**File Structure:**
```
~/.ccenv/
├── config.json          # All environment definitions
└── current_env          # Single line with current environment name

project-directory/
└── .ccenv               # Project-specific environment name
```

## Key Implementation Details

- Uses ESM modules (`"type": "module"` in package.json)
- All imports use `.js` extensions (TypeScript compiled output)
- Chalk for colored terminal output, Inquirer for interactive prompts
- Silent error handling in `init` command for robust shell integration
- Commander.js options pattern: commands accept options object parameter