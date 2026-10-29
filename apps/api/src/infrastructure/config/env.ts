export function validateEnvironment(environment: NodeJS.ProcessEnv) {
  const required = ['DATABASE_URL', 'JWT_SECRET'] as const;
  const missing = required.filter((key) => !environment[key]);
  if (missing.length > 0 && environment.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return environment;
}
