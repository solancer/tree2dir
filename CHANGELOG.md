# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2024-08-14

### Added
- End-to-end tests for file system operations
- Test mode flag for better error handling in tests

### Fixed
- Improved error propagation through Promise chains
- Fixed issue with error handling in test environment

## [1.1.0] - 2023-05-15

### Added
- Support for file paths with special characters
- Improved validation for ASCII tree structure
- Debug mode for detailed logging
- Interactive mode with loading indicators

### Changed
- Enhanced error handling with more specific error messages
- Refactored file creation logic for better reliability

### Fixed
- Issue with empty directory handling

## [1.0.0] - 2023-04-10

### Added
- Initial release of tree2dir
- Command-line interface for generating directory structures
- Support for converting ASCII tree diagrams to real directories
- Dry-run mode for previewing changes
- Basic error handling and validation 