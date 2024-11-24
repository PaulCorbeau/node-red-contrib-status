import * as fs from 'fs';
import type { PackageInfo } from '../types';
import type { NodeAPI } from 'node-red';

/**
 * Read and parse a package.json file
 * 
 * @param packagePath - Absolute path to the package.json file
 * @param RED - Node-RED API instance for logging
 * @throws {Error} When file reading fails
 * @throws {SyntaxError} When JSON parsing fails
 * @returns {PackageInfo | null} PackageInfo object if successful, null if file doesn't exist
 * 
 * @example
 * ```ts
 * const packageInfo = readPackageJson('/path/to/package.json', RED);
 * if (packageInfo) {
 *   console.log(packageInfo.name);
 *   console.log(packageInfo.version);
 * }
 * ```
 */
export function readPackageJson(packagePath: string, RED: NodeAPI): PackageInfo | null {
  try {
    if (fs.existsSync(packagePath)) {
      const content = fs.readFileSync(packagePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    RED.log.debug(`Error reading package.json at ${packagePath}: ${error}`);
  }
  return null;
}