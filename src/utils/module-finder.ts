import * as fs from 'fs';
import * as path from 'path';
import type { PackageInfo } from '../types';
import type { NodeAPI } from 'node-red';
import { readPackageJson } from './package-reader';

/**
 * Get information about all installed node modules
 * 
 * @param nodeModulesPath - Absolute path to the node_modules directory
 * @param RED - Node-RED API instance for logging
 * @returns Object containing information about all found modules
 * 
 * @example
 * ```ts
 * const modules = getNodeModules('/path/to/node_modules', RED);
 * console.log(Object.keys(modules).length + ' modules found');
 * ```
 */
export function getNodeModules(nodeModulesPath: string, RED: NodeAPI): { [key: string]: PackageInfo } {
  const modules: { [key: string]: PackageInfo } = {};

  try {
    if (!fs.existsSync(nodeModulesPath)) return modules;

    fs.readdirSync(nodeModulesPath).forEach(moduleName => {
      if (moduleName.startsWith('.') || moduleName === '.bin') return;

      const modulePath = path.join(nodeModulesPath, moduleName);
      const packageJsonPath = path.join(modulePath, 'package.json');
      const packageInfo = readPackageJson(packageJsonPath, RED);

      if (packageInfo) {
        modules[moduleName] = packageInfo;
      }
    });
  } catch (error) {
    RED.log.debug(`Error reading node_modules at ${nodeModulesPath}: ${error}`);
  }

  return modules;
}

/**
 * Filter Node-RED specific modules from installed modules
 * 
 * @param modules - Object containing all installed modules
 * @returns Object containing only Node-RED modules (modules with 'node-red' property)
 * 
 * @example
 * ```ts
 * const allModules = getNodeModules('/path/to/node_modules', RED);
 * const nodeRedModules = filterNodeRedModules(allModules);
 * console.log('Found ' + Object.keys(nodeRedModules).length + ' Node-RED modules');
 * ```
 */
export function filterNodeRedModules(modules: { [key: string]: PackageInfo }): { [key: string]: PackageInfo } {
  return Object.entries(modules)
    .filter(([_, info]) => info['node-red'])
    .reduce((acc, [name, info]) => {
      acc[name] = info;
      return acc;
    }, {} as { [key: string]: PackageInfo });
}