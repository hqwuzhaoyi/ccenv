import chalk from 'chalk';
import { getEnvironment, setCurrentEnvironment } from '../config/manager.js';

export async function useCommand(name: string, options: { source?: boolean } = {}): Promise<void> {
  try {
    const environment = await getEnvironment(name);
    
    if (!environment) {
      console.error(chalk.red(`Environment '${name}' not found`));
      console.log(chalk.dim('Use "ccenv list" to see available environments'));
      process.exit(1);
    }

    await setCurrentEnvironment(name);
    
    // If --source flag is provided, output shell commands for sourcing
    if (options.source) {
      console.log(`export ANTHROPIC_BASE_URL="${environment.anthropicBaseUrl}"`);
      console.log(`export ANTHROPIC_API_KEY="${environment.anthropicApiKey}"`);
      console.log(`echo "✓ Applied ccenv environment: ${name}"`);
      return;
    }
    
    console.log(chalk.green(`✓ Switched to environment: ${name}`));
    console.log();
    console.log(chalk.blue('Environment variables:'));
    console.log(`export ANTHROPIC_BASE_URL="${environment.anthropicBaseUrl}"`);
    console.log(`export ANTHROPIC_API_KEY="${environment.anthropicApiKey}"`);
    console.log();
    
    // Check if shell integration is likely available
    const isShellIntegrated = process.env.CCENV_SHELL_INTEGRATION === 'true';
    
    if (isShellIntegrated) {
      console.log(chalk.green('Environment variables will be automatically applied.'));
    } else {
      console.log(chalk.yellow('To auto-apply environment variables, install shell integration:'));
      console.log(chalk.cyan('ccenv install'));
      console.log();
      console.log(chalk.yellow('Or manually apply to current shell:'));
      console.log(chalk.cyan('eval "$(ccenv current --export)"'));
    }
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}