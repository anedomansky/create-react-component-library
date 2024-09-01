/**
 * Checks whether the provided package name is valid.
 * The used regular expression ensures that a package name in a Node.js project follows the naming conventions.
 * It allows for optional scope names and enforces lowercase letters, digits, hyphens, periods, underscores, and tildes in the package name.
 * @param packageName - The package name to validate
 * @returns Whether the package name is valid or not
 */
export function isValidPackageName(packageName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    packageName
  );
}
