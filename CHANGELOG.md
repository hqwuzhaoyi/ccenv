# ccenv

## 1.3.0

### Minor Changes

- 32a9d37: Make anthropicApiKey and anthropicAuthToken optional fields

  - Both `anthropicApiKey` and `anthropicAuthToken` are now optional in environment configuration
  - Removed `sk-` prefix validation for API keys
  - Updated all commands (add, list, current, init) to handle optional credentials
  - Users can now configure environments with:
    - Only anthropicApiKey
    - Only anthropicAuthToken
    - Both credentials
    - Neither (base URL only)

## 1.2.0

### Minor Changes

- Add optional ANTHROPIC_AUTH_TOKEN support

  - Added optional `anthropicAuthToken` field to Environment interface
  - Enhanced `add` command to prompt for optional auth token
  - Updated `current` and `init` commands to export auth token when present
  - Added masked display of auth token in environment details
  - Maintains full backward compatibility with existing environments

## 1.1.0

### Minor Changes

- 947c35c: Add interactive list navigation and improve user experience

  ## New Features

  - **Interactive list mode**: Use `ccenv list -i` or `ccenv list --interactive` for arrow key navigation
  - **Direct environment switching**: Select environments directly from the interactive list
  - **Automatic environment variable application**: Shell integration now automatically applies environment variables after interactive selection

  ## Improvements

  - **Enhanced shell integration**: Updated wrapper function to handle interactive list commands
  - **Better user guidance**: Improved messaging for shell integration status and manual application instructions
  - **Consistent UX**: Unified messaging style across `use` and `list` commands
  - **Version display**: Added help text clarifying version flag usage (-V or --version)

  ## Technical Changes

  - Added inquirer.js integration for interactive UI
  - Enhanced shell wrapper to detect environment changes in interactive mode
  - Improved error handling and user feedback
  - Added automatic eval execution for environment variable application

### Patch Changes

- f3b9e27: Add changesets for release management

  - Added @changesets/cli as dev dependency for automated release management
  - Updated package.json formatting (keywords array)
