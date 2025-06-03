// Utility to get the version from package.json
export function getAppVersion() {
  // Vite exposes import.meta.env for env variables, but not package.json directly.
  // We'll use import.meta.env.VITE_APP_VERSION, set via define in vite.config.ts
  return import.meta.env.VITE_APP_VERSION || '0.0.0'
}
