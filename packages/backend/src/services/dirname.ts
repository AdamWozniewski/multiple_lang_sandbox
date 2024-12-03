import { fileURLToPath } from "url";
import path from "path";

export const __dirname = (metaUrl: string) => {
  const __filename = fileURLToPath(metaUrl);
  return path.dirname(__filename);
};