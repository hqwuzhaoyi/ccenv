import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { Config, Environment } from '../types.js';

const CONFIG_DIR = join(homedir(), '.ccenv');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
const CURRENT_ENV_FILE = join(CONFIG_DIR, 'current_env');

export async function ensureConfigDir(): Promise<void> {
  try {
    await fs.access(CONFIG_DIR);
  } catch {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  }
}

export async function loadConfig(): Promise<Config> {
  try {
    await ensureConfigDir();
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      environments: [],
      currentEnvironment: undefined
    };
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function addEnvironment(env: Environment): Promise<void> {
  const config = await loadConfig();
  
  const existingIndex = config.environments.findIndex(e => e.name === env.name);
  if (existingIndex >= 0) {
    config.environments[existingIndex] = env;
  } else {
    config.environments.push(env);
  }
  
  await saveConfig(config);
}

export async function getEnvironment(name: string): Promise<Environment | undefined> {
  const config = await loadConfig();
  return config.environments.find(env => env.name === name);
}

export async function setCurrentEnvironment(name: string): Promise<void> {
  const config = await loadConfig();
  
  if (!config.environments.find(env => env.name === name)) {
    throw new Error(`Environment '${name}' not found`);
  }
  
  config.currentEnvironment = name;
  await saveConfig(config);
  
  // Save current environment to persistent file for shell integration
  await savePersistentEnvironment(name);
}

export async function savePersistentEnvironment(name: string): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CURRENT_ENV_FILE, name);
}

export async function loadPersistentEnvironment(): Promise<string | undefined> {
  try {
    const envName = await fs.readFile(CURRENT_ENV_FILE, 'utf8');
    return envName.trim();
  } catch {
    return undefined;
  }
}

export async function clearPersistentEnvironment(): Promise<void> {
  try {
    await fs.unlink(CURRENT_ENV_FILE);
  } catch {
    // File doesn't exist, nothing to do
  }
}