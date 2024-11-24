import { NodeDef } from "node-red";

/**
 * Node-RED status node configuration
 */
export interface NoderedStatus extends NodeDef {
  name: string;
}

/**
 * Package.json information structure
 */
export interface PackageInfo {
  name: string;
  version: string;
  description?: string;
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  'node-red'?: {
    nodes?: { [key: string]: string };
  };
}

/**
 * Root package.json structure with required dependencies
 */
export interface RootPackage extends PackageInfo {
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
}

/**
 * Node-RED information response structure
 */
export interface NodeRedInfo {
  nodeInfo: {
    id: string;
    type: string;
    name: string;
    z: string;
  };
  runtime: {
    platform: string;
    nodeVersion: string;
    arch: string;
    uptime: number;
    cwd: string;
    userDir?: string;
  };
  noderedInfo: {
    version: string;
    nodeRedModules: { [key: string]: PackageInfo };
    dependencies: { [key: string]: string };
    devDependencies: { [key: string]: string };
    stats: {
      totalNodeRedModules: number;
      totalDependencies: number;
      totalDevDependencies: number;
      totalInstalledModules: number;
    };
  };
}