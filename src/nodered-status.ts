import { NodeAPI, Node, NodeMessageInFlow } from "node-red";
import type { NoderedStatus, PackageInfo, NodeRedInfo } from './types';
import { readPackageJson, getNodeModules, filterNodeRedModules, getDeploymentUrls } from './utils';
import { paths } from './constants';

module.exports = (RED: NodeAPI) => {
  function NoderedStatus(this: Node, config: NoderedStatus): void {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", async (msg: NodeMessageInFlow, send: (msg: NodeMessageInFlow) => void) => {
      try {
        // Get Node-RED version
        const version = await RED.version();
        // Get user directory and paths
        const userDir = RED.settings.userDir || process.cwd();
        const { rootPackageJson, nodeModules } = paths(userDir);
        // Read root package.json and get dependencies
        const rootPackage = readPackageJson(rootPackageJson, RED) || {} as PackageInfo;
        const dependencies = rootPackage.dependencies || {};
        const devDependencies = rootPackage.devDependencies || {};
        // Get all installed modules and filter Node-RED
        const installedModules = getNodeModules(nodeModules, RED);
        const nodeRedModules = filterNodeRedModules(installedModules);
        // Get deployment URLs
        const deploymentInfo = getDeploymentUrls(RED);
        // Create response object
        const nodeRedInfo: NodeRedInfo = {
          nodeInfo: {
            id: node.id,
            type: node.type,
            name: node.name || node.type,
            z: node.z,
          },
          runtime: {
            platform: process.platform,
            nodeVersion: process.version,
            arch: process.arch,
            uptime: process.uptime(),
            cwd: process.cwd(),
            userDir: RED.settings.userDir,
          },
          noderedInfo: {
            deployment: deploymentInfo,
            version,
            nodeRedModules,
            dependencies,
            devDependencies,
            stats: {
              totalNodeRedModules: Object.keys(nodeRedModules).length,
              totalDependencies: Object.keys(dependencies).length,
              totalDevDependencies: Object.keys(devDependencies).length,
              totalInstalledModules: Object.keys(installedModules).length,
            }
          },
          summary: {
            runtimeUrl: deploymentInfo.runtimeUrl,
            adminUrl: deploymentInfo.adminUrl,
            domain: deploymentInfo.domain,
            port: deploymentInfo.port,
            platform: process.platform,
            uptime: process.uptime(),
            nodeVersion: process.version,
            noderedVersion: version,
            totalDependencies: Object.keys(dependencies).length,
            noderedDependencies: dependencies,
            totalDevDependencies: Object.keys(devDependencies).length,
            noderedDevDependencies: devDependencies,
          }

        };
        // Update node status
        node.status({
          fill: "green",
          shape: "dot",
          text: `NR: ${Object.keys(nodeRedModules).length}, Deps: ${Object.keys(dependencies).length}, Dev: ${Object.keys(devDependencies).length}`
        });
        // Send response
        msg.payload = nodeRedInfo;
        send(msg);

      } catch (error) {
        RED.log.error("Error in node execution: " + error);
        node.status({
          fill: "red",
          shape: "ring",
          text: "Error: " + (error as Error).message
        });
      }
    });
    // Clear status on node close
    node.on("close", () => {
      node.status({});
    });
  }
  // Register the node
  RED.nodes.registerType("nodered-status", NoderedStatus);
};