# ccenv

🚀 **Interactive CLI tool** for switching Claude Code environment variables quickly and seamlessly.

✨ **New in v1.1.0**: Interactive list navigation with arrow keys for seamless environment switching!

![](https://wuzhaoyi.oss-cn-shanghai.aliyuncs.com/amhCleanShot%202025-08-16%20at%2023.16.57@2x.png)

## ✨ Key Features

- 🎯 **Interactive Navigation** - Use arrow keys to browse and select environments
- ⚡ **Instant Switching** - One keystroke to change your entire Claude Code environment
- 🔄 **Automatic Application** - Environment variables applied immediately (with shell integration)
- 💾 **Persistent Sessions** - New terminals remember your last environment
- 📁 **Project-aware** - Automatically switch environments when entering project directories
- 🔧 **Shell Integration** - Works seamlessly with zsh, bash, and other shells
- 🎨 **Beautiful UI** - Colorful, intuitive command-line interface

## Quick Start

### 1. Install

```bash
npm install -g ccenv
# or
pnpm install -g ccenv
```

### 2. Add Environment Configuration

```bash
ccenv add work
# Interactive prompts for ANTHROPIC_BASE_URL and ANTHROPIC_API_KEY
```

### 3. Install Shell Integration (Recommended)

```bash
ccenv install
# Auto-detects and configures zsh/bash integration
source ~/.zshrc  # or source ~/.bashrc
```

### 4. Switch Environment

**🎯 Interactive Mode (Recommended)**
```bash
ccenv list -i
# Navigate with ↑↓ arrow keys
# Press Enter to select environment
# ✓ Switched to environment: work
# 🎉 Environment variables automatically applied!
```

**⚡ Direct Switch**
```bash
ccenv use work
# ✓ Applied ccenv environment: work
# Environment variables automatically applied to current shell
```

## Usage

### Core Commands

```bash
# Add new environment
ccenv add <name>

# 🎯 Interactive list (navigate with arrow keys)
ccenv list -i
ccenv list --interactive

# List all environments (traditional view)
ccenv list

# Switch environment (auto-apply with shell integration)
ccenv use <name>

# Show current environment
ccenv current

# Export environment variables
ccenv current --export
```

### 🎯 Interactive Features

**Navigate environments with ease using arrow keys:**

```bash
ccenv list -i
```

**What you get:**
- ↑↓ **Arrow key navigation** through all environments
- 📋 **Live preview** of Base URL and API Key (masked)
- ⚡ **Instant switching** - just press Enter to select
- 🔄 **Automatic application** of environment variables (with shell integration)
- 🔙 **Easy exit** - select "← Back" to return to standard list

**Demo:**
```
? Select an environment to switch to: (Use arrow keys)
❯ work (current)
  https://api.anthropic.com | sk-123...

  personal
  https://api.personal.com | sk-456...

  mirror
  https://api.mirror.com | sk-789...

  ← Back (just list)
```

### Shell Integration Features

After installing shell integration, you get these automated features:

1. **Auto-apply Environment Variables**
   ```bash
   ccenv use work      # Direct command mode
   ccenv list -i       # Interactive mode
   # Both automatically set environment variables, no manual eval needed!
   ```

2. **Persistent Environment**
   ```bash
   # New terminals automatically restore last environment
   echo $ANTHROPIC_BASE_URL  # Auto-loaded
   ```

3. **Project-level Environment**
   ```bash
   # Create .ccenv file in project directory
   echo "work" > .ccenv
   cd project  # Automatically switches to work environment
   ```

### Manual Integration

If you prefer not to install automatic integration:

```bash
# Manually apply to current shell
eval "$(ccenv current --export)"

# Or load specific environment
eval "$(ccenv use work --source)"
```

## Environment Variables

ccenv manages these environment variables for Claude Code:

- `ANTHROPIC_BASE_URL` - Anthropic API base URL
- `ANTHROPIC_API_KEY` - Anthropic API key

## Configuration Files

- `~/.ccenv/config.json` - Environment configurations
- `~/.ccenv/current_env` - Current environment persistence file
- `.ccenv` - Project-level environment configuration file

## Example Workflow

```bash
# Set up multiple environments
ccenv add work
ccenv add personal
ccenv add mirror

# Install automation
ccenv install

# 🎯 Interactive mode - navigate with arrow keys
ccenv list -i
# Select environment with Enter key
# ✓ Switched to environment: work
# 🎉 Environment variables automatically applied!

# Or direct command mode
ccenv use work
echo $ANTHROPIC_BASE_URL  # https://api.work.com

# New terminals automatically restore environment
# Projects with .ccenv files auto-switch environments
```

## Development

### Setup

```bash
# Clone repository
git clone <repository-url>
cd ccenv

# Install dependencies
pnpm install

# Development mode
pnpm dev <command> [args]
# Example: pnpm dev add test

# Build TypeScript to JavaScript
pnpm build

# Test built CLI
node dist/index.js --help
```

### Project Structure

```
ccenv/
├── src/
│   ├── commands/      # CLI command implementations
│   ├── config/        # Configuration management
│   ├── index.ts       # CLI entry point
│   └── types.ts       # TypeScript interfaces
├── dist/              # Built JavaScript files
├── package.json
└── tsconfig.json
```

### Architecture

- **CLI Framework**: Commander.js for argument parsing
- **Interactive Prompts**: Inquirer.js for user input
- **Configuration**: JSON files in `~/.ccenv/`
- **Shell Integration**: Dynamic script generation following volta/bun patterns

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm build` to ensure it compiles
5. Test with `node dist/index.js`
6. Submit a pull request