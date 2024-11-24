import { NodeAPI, Node, NodeMessageInFlow } from "node-red";
import type { NoderedStatus, PackageInfo, NodeRedInfo } from './types';
import { readPackageJson, getNodeModules, filterNodeRedModules } from './utils';
import { paths } from './constants';

module.exports = (RED: NodeAPI) => {
  function NoderedStatus(this: Node, config: NoderedStatus): void {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", async (msg: NodeMessageInFlow, send: (msg: NodeMessageInFlow) => void) => {
      try {
        // Attendre la version de Node-RED
        const version = await RED.version();

        const userDir = RED.settings.userDir || process.cwd();
        const { rootPackageJson, nodeModules } = paths(userDir);

        const rootPackage = readPackageJson(rootPackageJson, RED) || {} as PackageInfo;
        const dependencies = rootPackage.dependencies || {};
        const devDependencies = rootPackage.devDependencies || {};

        const installedModules = getNodeModules(nodeModules, RED);
        const nodeRedModules = filterNodeRedModules(installedModules);

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
          }
        };

        node.status({
          fill: "green",
          shape: "dot",
          text: `NR: ${Object.keys(nodeRedModules).length}, Deps: ${Object.keys(dependencies).length}, Dev: ${Object.keys(devDependencies).length}`
        });

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

    node.on("close", () => {
      node.status({});
    });
  }

  RED.nodes.registerType("nodered-status", NoderedStatus);
};