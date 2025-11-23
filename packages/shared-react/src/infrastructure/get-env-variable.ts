function getEnvVariable(key: string): string {
  // Try process.env first (Expo apps and Node.js environments)
  console.log(process.env)
  if (
    typeof process !== 'undefined' &&
    process.env &&
    process.env[`EXPO_${key}`] !== undefined
  ) {
    return process.env[`EXPO_${key}`]!;
  }

  // Try Vite's import.meta.env (web apps only)
  // Using indirect eval to avoid Hermes parse errors
  const globalEval = eval;
  try {
    const metaEnv = globalEval(
      'typeof import.meta !== "undefined" && import.meta.env'
    );
    if (metaEnv && typeof metaEnv === 'object' && `VITE_${key}` in metaEnv) {
      return metaEnv[`VITE_${key}`];
    }
  } catch {
    // import.meta not supported in this environment
  }

  throw new Error(`Environment variable ${key} is not defined`);
}

export { getEnvVariable };
