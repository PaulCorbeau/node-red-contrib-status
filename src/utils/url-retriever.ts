import type { NodeAPI } from "node-red";
import type { DeploymentInfo } from "../types";

/**
 * Get deployment URLs and domain for Node-RED instance
 *
 * @param RED - Node-RED API instance
 * @returns Object containing adminUrl, runtimeUrl, domain, and port
 *
 * @example
 * ```ts
 * const deploymentInfo = getDeploymentUrls(RED);
 * console.log(deploymentInfo.adminUrl); // e.g., http://localhost:1880/admin
 * ```
 */
export function getDeploymentUrls(RED: NodeAPI): DeploymentInfo {
  try {
    const httpAdminRoot = RED.settings.httpAdminRoot || "/";
    const httpRoot = RED.settings.httpRoot || "/";
    const uiPort = RED.settings.uiPort || 1880;

    // Determine the host (default to localhost if not set)
    const host = process.env.NODE_RED_HOST || "localhost";

    // Construct full URLs
    const adminUrl = `http://${host}:${uiPort}${httpAdminRoot}`;
    const runtimeUrl = `http://${host}:${uiPort}${httpRoot}`;

    return {
      adminUrl,
      deployUrl: RED.settings.httpAdminRoot || RED.settings.httpRoot || '/',
      runtimeUrl,
      domain: host,
      port: uiPort,
    };
  } catch (error) {
    RED.log.error("Failed to construct deployment URLs: " + error);
    return {
      adminUrl: "",
      deployUrl: "",
      runtimeUrl: "",
      domain: "unknown",
      port: 0,
    };
  }
}
