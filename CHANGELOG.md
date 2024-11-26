# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial implementation of `NoderedStatus` node.
- Function `getDeploymentUrls` to retrieve deployment URLs and domain for Node-RED instance.
- Function `getNodeModules` to get information about all installed node modules.
- Unit tests for `module-finder.ts`.

### Changed
- Refactored `NoderedStatus` to use `module.exports` for exporting the function.

### Fixed
- Corrected the issue with `NoderedStatus` not being exported properly.
- Fixed the issue with `readPackageJson` mock implementation in tests.

## [0.0.4] - 26/11/2024
### Changed
- Updated documentation for `NoderedStatus` node.
- Updated package.json to be aligned with Node-RED conventions.

## [0.0.3] - 25/11/2024
### Added
- Added tests for `getDeploymentUrls` function.
- Added tests for `getNodeModules` function.

## [0.0.2] - 24/11/2024
### Improved
- Minor improvements to the `NoderedStatus` node.
- Improved error handling in `getDeploymentUrls` function.

## [0.0.1] - 24/11/2024
### Added
- Initial release of the project.