import chalk from 'chalk';
import { loadConfig } from '../config/manager.js';

export async function listCommand(): Promise<void> {
  try {
    const config = await loadConfig();
    
    if (config.environments.length === 0) {
      console.log(chalk.yellow('No environments configured'));
      console.log(chalk.dim('Use "ccenv add <name>" to add an environment'));
      return;
    }

    console.log(chalk.blue('Available environments:'));
    
    config.environments.forEach(env => {
      const isCurrent = env.name === config.currentEnvironment;
      const prefix = isCurrent ? chalk.green('●') : ' ';
      const name = isCurrent ? chalk.green.bold(env.name) : env.name;
      const suffix = isCurrent ? chalk.gray(' (current)') : '';
      
      console.log(`${prefix} ${name}${suffix}`);
      console.log(`  ${chalk.dim('Base URL:')} ${env.anthropicBaseUrl}`);
      console.log(`  ${chalk.dim('API Key:')} ${env.anthropicApiKey.substring(0, 7)}...`);
      console.log();
    });
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}