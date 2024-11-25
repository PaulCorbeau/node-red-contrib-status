import { getDeploymentUrls } from '../utils/url-retriever';
import type { NodeAPI } from 'node-red';
const NoderedStatus = require('../nodered-status');

describe('nodered-status functionality', () => {
  let RED: NodeAPI;

  beforeEach(() => {
    RED = {
      settings: {
        httpAdminRoot: '/admin',
        httpRoot: '/',
        uiPort: 1880,
      },
      log: {
        error: jest.fn(),
      },
    } as unknown as NodeAPI;
  });

  it('should return correct nodeRedInfo', () => {

    const deploymentInfo = getDeploymentUrls(RED);


    expect(deploymentInfo).toEqual({
      adminUrl: 'http://localhost:1880/admin',
      deployUrl: '/admin',
      runtimeUrl: 'http://localhost:1880/',
      domain: 'localhost',
      port: 1880,
    });
  });
});