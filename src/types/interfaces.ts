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
 * Deployment information structure
 */
export interface DeploymentInfo {
  adminUrl: string;
  deployUrl: string;
  runtimeUrl: string;
  domain: string;
  port: number;
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
    deployment: DeploymentInfo;
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
  summary: {
    runtimeUrl: string;
    adminUrl: string;
    domain: string;
    port: number;
    platform: string;
    uptime: number;
    nodeVersion: string;
    noderedVersion: string;
    totalDependencies: number;
    nodeDependencies: { [key: string]: string };
    totalDevDependencies: number;
    nodeDevDependencies: { [key: string]: string };
  }
}