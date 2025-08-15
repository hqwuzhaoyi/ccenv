import chalk from 'chalk';
import { loadConfig, getEnvironment } from '../config/manager.js';

export async function currentCommand(options: { export?: boolean } = {}): Promise<void> {
  try {
    const config = await loadConfig();
    
    if (!config.currentEnvironment) {
      if (options.export) {
        // Silent exit for export mode when no environment is set
        return;
      }
      console.log(chalk.yellow('No environment is currently active'));
      console.log(chalk.dim('Use "ccenv use <name>" to set an environment'));
      return;
    }

    const environment = await getEnvironment(config.currentEnvironment);
    
    if (!environment) {
      console.error(chalk.red('Current environment configuration not found'));
      process.exit(1);
    }

    // Check if --export flag is provided
    if (options.export) {
      console.log(`export ANTHROPIC_BASE_URL="${environment.anthropicBaseUrl}"`);
      console.log(`export ANTHROPIC_API_KEY="${environment.anthropicApiKey}"`);
      return;
    }

    console.log(chalk.blue(`Current environment: ${chalk.bold(environment.name)}`));
    console.log();
    console.log(`${chalk.dim('Base URL:')} ${environment.anthropicBaseUrl}`);
    console.log(`${chalk.dim('API Key:')} ${environment.anthropicApiKey.substring(0, 7)}...`);
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}