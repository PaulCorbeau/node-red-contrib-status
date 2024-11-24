import { NodeAPI, Node, NodeDef, NodeMessageInFlow } from "node-red";

interface NoderedStatus extends NodeDef {
  name: string;
}

module.exports = (RED: NodeAPI) => {
  function NoderedStatus(this: Node, config: NoderedStatus): void {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", (msg: NodeMessageInFlow, send: (msg: NodeMessageInFlow) => void) => {
      msg.payload = `Hello, ${msg.payload}`;
      send(msg);
    });
  }

  RED.nodes.registerType("nodered-status", NoderedStatus);
};