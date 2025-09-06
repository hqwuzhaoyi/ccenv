import { loadPersistentEnvironment, getEnvironment } from '../config/manager.js';

const SHELL_INTEGRATION = `
# ccenv shell integration
export CCENV_SHELL_INTEGRATION=true

# Enhanced ccenv wrapper function
ccenv() {
    if [ "$1" = "use" ] && [ -n "$2" ]; then
        # For 'use' command, capture and apply environment variables
        local result=$(command ccenv use "$2" --source 2>&1)
        local exit_code=$?
        
        if [ $exit_code -eq 0 ]; then
            eval "$result"
        else
            echo "$result" >&2
            return $exit_code
        fi
    elif [ "$1" = "list" ] && ([ "$2" = "-i" ] || [ "$2" = "--interactive" ]); then
        # For interactive list, run command and check if environment changed
        local before_env=$(command ccenv current --export 2>/dev/null)
        command ccenv "$@"
        local exit_code=$?
        local after_env=$(command ccenv current --export 2>/dev/null)
        
        # If environment changed, apply the new environment variables
        if [ $exit_code -eq 0 ] && [ "$before_env" != "$after_env" ] && [ -n "$after_env" ]; then
            eval "$after_env"
        fi
        
        return $exit_code
    else
        # For other commands, run normally
        command ccenv "$@"
    fi
}

# Auto-load environment when entering directory with .ccenv file
ccenv_dir_load() {
    if [ -f ".ccenv" ] && [ -r ".ccenv" ]; then
        local env_name=$(cat .ccenv | tr -d '\\n\\r' | xargs)
        if [ -n "$env_name" ]; then
            ccenv use "$env_name" >/dev/null 2>&1
        fi
    fi
}

# Hook into directory changes
if [ -n "$ZSH_VERSION" ]; then
    # Zsh
    autoload -U add-zsh-hook 2>/dev/null
    if type add-zsh-hook >/dev/null 2>&1; then
        add-zsh-hook chpwd ccenv_dir_load
    else
        # Fallback for older zsh versions
        chpwd_functions+=(ccenv_dir_load)
    fi
elif [ -n "$BASH_VERSION" ]; then
    # Bash
    PROMPT_COMMAND="\${PROMPT_COMMAND:+\$PROMPT_COMMAND\$'\\n'}ccenv_dir_load"
fi

# Auto-load current environment
if command -v ccenv &> /dev/null; then
    eval "\$(ccenv init 2>/dev/null || true)"
fi
`.trim();

export async function initCommand(options: { shell?: boolean } = {}): Promise<void> {
  try {
    // If --shell flag is provided, output shell integration script
    if (options.shell) {
      console.log(SHELL_INTEGRATION);
      return;
    }

    // Default behavior: load current environment
    const persistentEnv = await loadPersistentEnvironment();
    
    if (!persistentEnv) {
      // No persistent environment, silent exit
      return;
    }

    const environment = await getEnvironment(persistentEnv);
    
    if (!environment) {
      // Environment not found, silent exit
      return;
    }

    // Output environment variables for shell to source
    console.log(`export ANTHROPIC_BASE_URL="${environment.anthropicBaseUrl}"`);
    console.log(`export ANTHROPIC_API_KEY="${environment.anthropicApiKey}"`);
    if (environment.anthropicAuthToken) {
      console.log(`export ANTHROPIC_AUTH_TOKEN="${environment.anthropicAuthToken}"`);
    }
    
  } catch (error) {
    // Silent failure for init command
    return;
  }
}