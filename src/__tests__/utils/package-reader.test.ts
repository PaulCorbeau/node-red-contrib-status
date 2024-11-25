import * as fs from 'fs';
import { readPackageJson } from '../../utils/package-reader';
import type { NodeAPI } from 'node-red';

jest.mock('fs');

describe('readPackageJson', () => {
  const RED: NodeAPI = {
    log: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  } as unknown as NodeAPI;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return PackageInfo object when package.json exists and is valid', () => {
    const packagePath = '/path/to/package.json';
    const packageContent = JSON.stringify({ name: 'test-package', version: '1.0.0' });

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(packageContent);

    const result = readPackageJson(packagePath, RED);

    expect(result).toEqual({ name: 'test-package', version: '1.0.0' });
    expect(fs.existsSync).toHaveBeenCalledWith(packagePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(packagePath, 'utf8');
  });

  it('should return null when package.json does not exist', () => {
    const packagePath = '/path/to/nonexistent/package.json';

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = readPackageJson(packagePath, RED);

    expect(result).toBeNull();
    expect(fs.existsSync).toHaveBeenCalledWith(packagePath);
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  it('should log an error and return null when reading package.json fails', () => {
    const packagePath = '/path/to/package.json';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File read error');
    });

    const result = readPackageJson(packagePath, RED);

    expect(result).toBeNull();
    expect(fs.existsSync).toHaveBeenCalledWith(packagePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(packagePath, 'utf8');
    expect(RED.log.debug).toHaveBeenCalledWith(`Error reading package.json at ${packagePath}: Error: File read error`);
  });

  it('should log an error and return null when JSON parsing fails', () => {
    const packagePath = '/path/to/package.json';
    const invalidJsonContent = '{ name: "test-package", version: "1.0.0" }'; // Invalid JSON

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(invalidJsonContent);

    const result = readPackageJson(packagePath, RED);

    expect(result).toBeNull();
    expect(fs.existsSync).toHaveBeenCalledWith(packagePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(packagePath, 'utf8');
    expect(RED.log.debug).toHaveBeenCalledWith(expect.stringContaining('Error reading package.json at'));
  });
});