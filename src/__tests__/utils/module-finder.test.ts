import { getNodeModules, filterNodeRedModules } from '../../utils/module-finder';
import * as fs from 'fs';
import * as path from 'path';
import { NodeAPI } from 'node-red';
import { PackageInfo } from '../../types';
const readPackageJson = require('../../utils/package-reader').readPackageJson;

jest.mock('fs');
jest.mock('path');
jest.mock('../../utils/package-reader', () => ({
  readPackageJson: jest.fn()
}));

const RED: NodeAPI = {
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
} as unknown as NodeAPI;

describe('module-finder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNodeModules', () => {
    it('should return an empty object if nodeModulesPath does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = getNodeModules('/invalid/path', RED);
      expect(result).toEqual({});
    });

    it('should return an empty object if nodeModulesPath is empty', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue([]);

      const result = getNodeModules('/empty/path', RED);
      expect(result).toEqual({});
    });

    it.skip('should return modules information', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['module1', 'module2']);
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (path.basename as jest.Mock).mockImplementation((path: string) => {
        const parts = path.split('/');
        return parts[parts.length - 1];
      });
      (readPackageJson as jest.Mock).mockImplementation((packageJsonPath: string, RED: NodeAPI) => {
        const moduleName = path.basename(path.dirname(packageJsonPath));
        return {
          name: moduleName,
          version: '1.0.0'
        };
      });

      const result = getNodeModules('/valid/path', RED);
      expect(result).toEqual({
        module1: { name: 'module1', version: '1.0.0' },
        module2: { name: 'module2', version: '1.0.0' }
      });
    });

    it('should handle errors gracefully', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      const result = getNodeModules('/error/path', RED);
      expect(result).toEqual({});
      expect(RED.log.debug).toHaveBeenCalledWith('Error reading node_modules at /error/path: Error: Test error');
    });

    it.skip('should skip hidden directories and .bin', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['.hidden', '.bin', 'validModule']);
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
      (readPackageJson as jest.Mock).mockImplementation((packageJsonPath: string, RED: NodeAPI) => {
        const moduleName = path.basename(path.dirname(packageJsonPath));
        return {
          name: moduleName,
          version: '1.0.0'
        };
      });

      const result = getNodeModules('/valid/path', RED);
      expect(result).toEqual({
        validModule: { name: 'validModule', version: '1.0.0' }
      });
    });
  });

  describe('filterNodeRedModules', () => {
    it('should return only Node-RED modules', () => {
      const modules: { [key: string]: PackageInfo } = {
        module1: { name: 'module1', version: '1.0.0', 'node-red': {} },
        module2: { name: 'module2', version: '1.0.0' }
      };

      const result = filterNodeRedModules(modules);
      expect(result).toEqual({
        module1: { name: 'module1', version: '1.0.0', 'node-red': {} }
      });
    });

    it('should return an empty object if no Node-RED modules are found', () => {
      const modules: { [key: string]: PackageInfo } = {
        module1: { name: 'module1', version: '1.0.0' },
        module2: { name: 'module2', version: '1.0.0' }
      };

      const result = filterNodeRedModules(modules);
      expect(result).toEqual({});
    });
  });
});