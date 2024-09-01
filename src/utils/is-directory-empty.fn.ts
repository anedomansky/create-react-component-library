import fs from "node:fs";

/**
 * Check if the directory is empty or only includes the .git folder
 * @param directory - The directory path
 * @returns Whether the directory is empty or not
 */
export function isDirectoryEmpty(directory: string) {
  const files = fs.readdirSync(directory);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}
