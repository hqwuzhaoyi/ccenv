#!/usr/bin/env node
import { program } from 'commander';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { useCommand } from './commands/use.js';
import { currentCommand } from './commands/current.js';
import { installCommand } from './commands/install.js';
import { initCommand } from './commands/init.js';

program
  .name('ccenv')
  .description('Claude Code environment variable switcher')
  .version('1.1.0');

// Add support for lowercase -v as well
program.addHelpText('after', '\nVersion can also be displayed with: ccenv -V or --version');

program
  .command('add')
  .description('Add a new environment configuration')
  .argument('<name>', 'Environment name')
  .action(addCommand);

program
  .command('list')
  .description('List all environment configurations')
  .option('-i, --interactive', 'Enable interactive mode with arrow key navigation')
  .action(listCommand);

program
  .command('use')
  .description('Switch to an environment')
  .argument('<name>', 'Environment name')
  .option('--source', 'Output shell commands for sourcing')
  .action(useCommand);

program
  .command('current')
  .description('Show current environment')
  .option('--export', 'Export environment variables for shell eval')
  .action(currentCommand);

program
  .command('install')
  .description('Install shell integration')
  .action(installCommand);

program
  .command('init')
  .description('Initialize environment (for shell integration)')
  .option('--shell', 'Output shell integration script')
  .action(initCommand);

program.parse();