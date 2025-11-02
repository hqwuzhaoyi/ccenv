export interface Environment {
  name: string;
  anthropicBaseUrl: string;
  anthropicApiKey?: string;
  anthropicAuthToken?: string;
  isActive?: boolean;
}

export interface Config {
  environments: Environment[];
  currentEnvironment?: string;
}