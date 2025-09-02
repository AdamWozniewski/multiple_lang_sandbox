import manifest from "../../public/manifest.json";

export const assetPathHelper = (name: string): string => {
  const entry = manifest[name];
  if (!entry) throw new Error(`Asset not found: ${name}`);
  return "/public/" + entry.file;
};
