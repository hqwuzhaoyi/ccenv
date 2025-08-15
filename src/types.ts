export interface Environment {
  name: string;
  anthropicBaseUrl: string;
  anthropicApiKey: string;
  isActive?: boolean;
}

export interface Config {
  environments: Environment[];
  currentEnvironment?: string;
}