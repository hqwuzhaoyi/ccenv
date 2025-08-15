import chalk from 'chalk';
import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import inquirer from 'inquirer';

const SIMPLE_INTEGRATION = `
# ccenv shell integration
export CCENV_HOME="$HOME/.ccenv"
eval "$(ccenv init --shell)"
`.trim();

export async function installCommand(): Promise<void> {
  try {
    console.log(chalk.blue('Installing ccenv shell integration...'));
    console.log();

    // Detect shell
    const shell = process.env.SHELL || '';
    let shellRc = '';

    if (shell.includes('zsh')) {
      shellRc = join(homedir(), '.zshrc');
    } else if (shell.includes('bash')) {
      shellRc = join(homedir(), '.bashrc');
    } else {
      console.log(chalk.yellow('Shell detection failed. Please select your shell:'));
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'shell',
          message: 'Which shell are you using?',
          choices: [
            { name: 'Zsh (.zshrc)', value: 'zsh' },
            { name: 'Bash (.bashrc)', value: 'bash' },
            { name: 'Other (manual installation)', value: 'manual' }
          ]
        }
      ]);

      if (answer.shell === 'manual') {
        console.log(chalk.blue('Manual installation:'));
        console.log(chalk.yellow('Add the following to your shell configuration file:'));
        console.log();
        console.log(chalk.gray(SIMPLE_INTEGRATION));
        return;
      }

      shellRc = answer.shell === 'zsh' ? join(homedir(), '.zshrc') : join(homedir(), '.bashrc');
    }

    // Check if already installed
    try {
      const content = await fs.readFile(shellRc, 'utf8');
      if (content.includes('ccenv shell integration') || content.includes('ccenv init --shell')) {
        console.log(chalk.yellow('ccenv shell integration is already installed'));
        
        const answer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'reinstall',
            message: 'Do you want to reinstall it?',
            default: false
          }
        ]);
        
        if (!answer.reinstall) {
          return;
        }
        
        // Remove existing integration (both old and new formats)
        const cleanedContent = content
          .replace(/# ccenv shell integration[\s\S]*?eval "\$\(ccenv init --shell\)"/g, '')
          .replace(/# ccenv shell integration[\s\S]*?ccenv_auto_load/g, '')
          .replace(/\n\n\n+/g, '\n\n');
        
        await fs.writeFile(shellRc, cleanedContent);
      }
    } catch {
      // File doesn't exist, create it
    }

    // Add simple integration
    const integrationContent = `\n\n${SIMPLE_INTEGRATION}\n`;
    await fs.appendFile(shellRc, integrationContent);

    console.log(chalk.green(`✓ Shell integration installed to ${shellRc}`));
    console.log();
    console.log(chalk.blue('To activate the integration:'));
    console.log(chalk.cyan(`source ${shellRc}`));
    console.log(chalk.dim('or restart your terminal'));
    console.log();
    console.log(chalk.green('Features enabled:'));
    console.log('  • Auto-apply environment variables with "ccenv use"');
    console.log('  • Auto-load environment on shell start');
    console.log('  • Auto-switch environment based on .ccenv file');
    console.log();
    console.log(chalk.dim('Integration is now simplified and follows volta/bun pattern'));

  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}