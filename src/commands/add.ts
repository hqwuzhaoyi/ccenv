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
      }
    ]);

    const environment: Environment = {
      name,
      anthropicBaseUrl: answers.anthropicBaseUrl,
      anthropicApiKey: answers.anthropicApiKey
    };

    await addEnvironment(environment);
    console.log(chalk.green(`✓ Environment '${name}' added successfully`));
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}