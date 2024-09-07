type PackageManager = {
  name: string;
  version: string;
};

/**
 * Retrieves the package manager information from the user agent string.
 * @param userAgent - The user agent string.
 * @returns - The package manager information or null if the user agent is empty.
 */
export function getPackageManager(userAgent?: string): PackageManager | null {
  if (!userAgent) {
    return null;
  }

  const packageManager = userAgent.split(" ")[0];
  const packageManagerArray = packageManager.split("/");

  return {
    name: packageManagerArray[0],
    version: packageManagerArray[1],
  };
}
