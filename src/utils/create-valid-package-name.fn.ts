/**
 * Creates a valid package name from the provided package name.
 * @param packageName - The package name to create a valid package name from
 * @returns The valid package name
 */
export function createValidPackageName(packageName: string) {
  return packageName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}
