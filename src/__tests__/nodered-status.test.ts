import { NodeAPI, Node, NodeMessageInFlow } from "node-red";

describe("NoderedStatus Node", () => {
  let RED: jest.Mocked<NodeAPI>;
  let nodeInstance: Node;

  beforeEach(() => {
    // Mock Node-RED API
    RED = {
      nodes: {
        createNode: jest.fn(),
        registerType: jest.fn(),
      },
      version: jest.fn().mockResolvedValue("3.0.0"),
      settings: {
        userDir: "/mock/user/dir",
      },
      log: {
        error: jest.fn(),
      },
    } as unknown as jest.Mocked<NodeAPI>;

    // Mock `this` context for the node
    nodeInstance = {
      id: "1",
      type: "nodered-status",
      on: jest.fn(),
      status: jest.fn(),
    } as unknown as Node;
  });

  it("should register the node type", () => {
    // Import the module to be tested
    const noderedStatus = require("../nodered-status");

    // Execute the registration
    noderedStatus(RED);

    // Assert that the node type was registered
    expect(RED.nodes.registerType).toHaveBeenCalledWith(
      "nodered-status",
      expect.any(Function)
    );
  });

  it("should create the node and handle input messages", async () => {
    const createNodeCallback = jest.fn();
    (RED.nodes.createNode as jest.Mock).mockImplementation((node, config) => {
      createNodeCallback(node, config);
    });

    // Import the module to be tested
    const noderedStatus = require("../nodered-status");

    // Register the node
    noderedStatus(RED);

    // Retrieve the node constructor
    const nodeConstructor = (RED.nodes.registerType as jest.Mock).mock.calls[0][1];

    // Mock message and send function
    const mockMsg = { payload: {} } as NodeMessageInFlow;
    const mockSend = jest.fn();

    // Create a node instance
    nodeConstructor.call(nodeInstance, {});

    // Trigger the "input" event
    const onInput = (nodeInstance.on as jest.Mock).mock.calls.find(([event]) => event === "input")[1];
    await onInput(mockMsg, mockSend);

    // Validate results
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({
        noderedInfo: expect.any(Object)
      }),
    }));
    expect(nodeInstance.status).toHaveBeenCalledWith({
      fill: "green",
      shape: "dot",
      text: expect.stringMatching(/Nodered Dependencies/),
    });
  });

  it("should handle errors during input handling", async () => {
    const errorMessage = "Test error";
    (RED.version as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Import and register the node
    const noderedStatus = require("../nodered-status");
    noderedStatus(RED);
    const nodeConstructor = (RED.nodes.registerType as jest.Mock).mock.calls[0][1];

    // Mock message and send function
    const mockMsg = { payload: {} } as NodeMessageInFlow;
    const mockSend = jest.fn();

    // Create a node instance
    nodeConstructor.call(nodeInstance, {});

    // Trigger the "input" event
    const onInput = (nodeInstance.on as jest.Mock).mock.calls.find(([event]) => event === "input")[1];
    await onInput(mockMsg, mockSend);

    // Validate that the error was handled
    expect(RED.log.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    expect(nodeInstance.status).toHaveBeenCalledWith({
      fill: "red",
      shape: "ring",
      text: expect.stringContaining(errorMessage),
    });
  });
});