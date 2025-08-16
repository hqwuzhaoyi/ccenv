---
"ccenv": minor
---

Add interactive list navigation and improve user experience

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