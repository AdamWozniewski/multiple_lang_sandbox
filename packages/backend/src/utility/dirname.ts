import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Converts a module's meta URL to its directory path.
 * @param metaUrl - The `import.meta.url` of the module.
 * @returns The directory path of the module.
 */
export const __dirname = (metaUrl: string): string => {
  const __filename = fileURLToPath(metaUrl);
  return path.dirname(__filename);
};