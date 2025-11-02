import chalk from 'chalk';
import inquirer from 'inquirer';
import { loadConfig, setCurrentEnvironment } from '../config/manager.js';

interface ListOptions {
  interactive?: boolean;
}

export async function listCommand(options: ListOptions = {}): Promise<void> {
  try {
    const config = await loadConfig();
    
    if (config.environments.length === 0) {
      console.log(chalk.yellow('No environments configured'));
      console.log(chalk.dim('Use "ccenv add <name>" to add an environment'));
      return;
    }

    // If interactive mode is enabled
    if (options.interactive) {
      const choices = config.environments.map(env => {
        const isCurrent = env.name === config.currentEnvironment;
        const displayName = isCurrent ? `${env.name} (current)` : env.name;
        const apiKeyPart = env.anthropicApiKey ? `${env.anthropicApiKey.substring(0, 7)}...` : env.anthropicAuthToken ? 'auth token' : 'no credentials';
        const description = `${env.anthropicBaseUrl} | ${apiKeyPart}`;

        return {
          name: `${displayName}\n  ${chalk.dim(description)}`,
          value: env.name,
          short: env.name
        };
      });

      choices.push({
        name: chalk.gray('← Back (just list)'),
        value: '__back__',
        short: 'Back'
      });

      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'environment',
          message: 'Select an environment to switch to:',
          choices,
          pageSize: 10,
          loop: false
        }
      ]);

      if (answer.environment === '__back__') {
        // Just show the list without interaction
        showEnvironmentsList(config);
        return;
      }

      // Switch to selected environment
      await setCurrentEnvironment(answer.environment);
      console.log(chalk.green(`✓ Switched to environment: ${answer.environment}`));
      
      // Show instructions for manual mode users
      if (!process.env.CCENV_SHELL_INTEGRATION) {
        console.log(chalk.yellow('\n⚠️  Environment variables not automatically applied'));
        console.log(chalk.dim('Shell integration is not installed. To apply the changes:'));
        console.log(chalk.cyan('\n  eval "$(ccenv current --export)"'));
        console.log(chalk.dim('\nOr install shell integration with:'));
        console.log(chalk.cyan('  ccenv install'));
        console.log(chalk.dim('  source ~/.zshrc  # (or ~/.bashrc)'));
      } else {
        console.log(chalk.green('\n🎉 Environment variables will be automatically applied by shell integration!'));
        console.log(chalk.dim('The shell wrapper will detect the environment change and apply it.'));
      }
    } else {
      // Standard list view
      showEnvironmentsList(config);
    }
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

function showEnvironmentsList(config: any): void {
  console.log(chalk.blue('Available environments:'));
  
  config.environments.forEach((env: any) => {
    const isCurrent = env.name === config.currentEnvironment;
    const prefix = isCurrent ? chalk.green('●') : ' ';
    const name = isCurrent ? chalk.green.bold(env.name) : env.name;
    const suffix = isCurrent ? chalk.gray(' (current)') : '';
    
    console.log(`${prefix} ${name}${suffix}`);
    console.log(`  ${chalk.dim('Base URL:')} ${env.anthropicBaseUrl}`);
    if (env.anthropicApiKey) {
      console.log(`  ${chalk.dim('API Key:')} ${env.anthropicApiKey.substring(0, 7)}...`);
    }
    if (env.anthropicAuthToken) {
      console.log(`  ${chalk.dim('Auth Token:')} ${env.anthropicAuthToken.substring(0, 7)}...`);
    }
    console.log();
  });

  console.log(chalk.dim('Tip: Use "ccenv list --interactive" for arrow key navigation'));
}