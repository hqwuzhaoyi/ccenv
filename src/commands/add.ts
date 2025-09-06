import inquirer from 'inquirer';
import chalk from 'chalk';
import { addEnvironment } from '../config/manager.js';
import { Environment } from '../types.js';

export async function addCommand(name: string): Promise<void> {
  try {
    console.log(chalk.blue(`Adding new environment: ${name}`));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'anthropicBaseUrl',
        message: 'ANTHROPIC_BASE_URL:',
        default: 'https://api.anthropic.com',
        validate: (input: string) => {
          if (!input.trim()) return 'Base URL is required';
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'password',
        name: 'anthropicApiKey',
        message: 'ANTHROPIC_API_KEY:',
        mask: '*',
        validate: (input: string) => {
          if (!input.trim()) return 'API key is required';
          if (!input.startsWith('sk-')) return 'API key should start with "sk-"';
          return true;
        }
      },
      {
        type: 'password',
        name: 'anthropicAuthToken',
        message: 'ANTHROPIC_AUTH_TOKEN (optional):',
        mask: '*',
        validate: (input: string) => {
          if (!input.trim()) return true; // Optional field
          return true;
        }
      }
    ]);

    const environment: Environment = {
      name,
      anthropicBaseUrl: answers.anthropicBaseUrl,
      anthropicApiKey: answers.anthropicApiKey,
      ...(answers.anthropicAuthToken?.trim() && { anthropicAuthToken: answers.anthropicAuthToken })
    };

    await addEnvironment(environment);
    console.log(chalk.green(`✓ Environment '${name}' added successfully`));
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}