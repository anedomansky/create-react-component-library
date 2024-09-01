import path from "node:path";

/**
 * Get the project name from the directory path
 * @param directory - The directory path
 * @returns The project name
 */
export function getProjectName(directory: string) {
  return directory === "." ? path.basename(path.resolve()) : directory;
}
