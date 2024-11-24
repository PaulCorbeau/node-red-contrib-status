# Node-RED Status Node

The **Node-RED Status** node provides detailed information about the current Node-RED runtime environment. It can be used for diagnostics and monitoring purposes. Here's what it offers:

## Features
- **Runtime Information**:
  - Node-RED version.
  - Platform details: OS, Node.js version, architecture.
  - Uptime and working directory.
- **Dependency Analysis**:
  - List of runtime and development dependencies.
  - Statistics on the total number of dependencies and Node-RED modules.
- **Installed Modules**:
  - Detailed information about Node-RED-specific modules installed in the environment.

## How It Works
When triggered, the node sends a payload containing:
1. Runtime and platform details.
2. A breakdown of Node-RED modules, dependencies, and their statistics.

The node's status updates dynamically:
- **Green**: Running successfully, with a summary of Node-RED modules and dependencies.
- **Red**: An error occurred, and the status displays the error message.

## Example Payload
The node outputs an object with the following structure:
```json
{
  "nodeInfo": {
    "id": "node-id",
    "type": "nodered-status",
    "name": "Node Name",
    "z": "flow-id"
  },
  "runtime": {
    "platform": "linux",
    "nodeVersion": "v16.18.1",
    "arch": "x64",
    "uptime": 123456.789,
    "cwd": "/usr/src/node-red",
    "userDir": "/data"
  },
  "noderedInfo": {
    "deployment": { ... },
    "version": "3.0.0",
    "nodeRedModules": { ... },
    "dependencies": { ... },
    "devDependencies": { ... },
    "stats": {
      "totalNodeRedModules": 10,
      "totalDependencies": 15,
      "totalDevDependencies": 5,
      "totalInstalledModules": 25
    }
  },
  "summary": {
    "runtimeUrl": "http://localhost:1880/",
    "adminUrl": "http://localhost:1880/admin",
    "domain": "localhost",
    "port": 1880,
    "platform": "linux",
    "uptime": 123456.789,
    "nodeVersion": "v16.18.1",
    "noderedVersion": "3.0.0",
    "totalDependencies": 15,
    "nodeDependencies": { ... },
    "totalDevDependencies": 5,
    "nodeDevDependencies": { ... }
  }
}