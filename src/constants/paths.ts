/**
 * Path configurations for the Node-RED module
 */
import * as path from 'path';

const getPaths = (userDir: string = process.cwd()) => ({
  /**
   * Root package.json path
   */
  rootPackageJson: path.join(userDir, 'package.json'),

  /**
   * Node modules directory path
   */
  nodeModules: path.join(userDir, 'node_modules'),

  /**
   * User directory path
   */
  userDir
});

export default getPaths;