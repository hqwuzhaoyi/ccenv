#!/bin/bash

# ccenv enhanced shell integration
export CCENV_SHELL_INTEGRATION=true

# Auto-load ccenv environment on shell start
ccenv_auto_load() {
    if command -v ccenv &> /dev/null; then
        local current_env=$(ccenv current --export 2>/dev/null)
        if [ $? -eq 0 ] && [ -n "$current_env" ]; then
            eval "$current_env"
        fi
    fi
}

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
    else
        # For other commands, run normally
        command ccenv "$@"
    fi
}

# Auto-load environment when entering directory with .ccenv file
ccenv_dir_load() {
    if [ -f ".ccenv" ] && [ -r ".ccenv" ]; then
        local env_name=$(cat .ccenv | tr -d '\n\r' | xargs)
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
    PROMPT_COMMAND="${PROMPT_COMMAND:+$PROMPT_COMMAND$'\n'}ccenv_dir_load"
fi

# Auto-load on shell start (only if not already loaded to avoid loops)
if [ -z "$CCENV_LOADED" ]; then
    export CCENV_LOADED=true
    ccenv_auto_load
fi