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
    
    // Check if shell integration is likely available
    const isShellIntegrated = process.env.CCENV_SHELL_INTEGRATION === 'true';
    
    if (isShellIntegrated) {
      console.log(chalk.green('Environment variables automatically applied! 🎉'));
    } else {
      console.log(chalk.yellow('\n⚠️  Environment variables not automatically applied'));
      console.log(chalk.dim('Shell integration is not installed. To apply the changes:'));
      console.log(chalk.cyan('\n  eval "$(ccenv current --export)"'));
      console.log(chalk.dim('\nOr install shell integration with:'));
      console.log(chalk.cyan('  ccenv install'));
      console.log(chalk.dim('  source ~/.zshrc  # (or ~/.bashrc)'));
    }
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}