# Contributing to tree2dir

Thank you for considering contributing to tree2dir! This document outlines the process for contributing to the project and helps ensure a smooth collaboration experience.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
  - [Branches](#branches)
  - [Commits](#commits)
  - [Pull Requests](#pull-requests)
- [Testing](#testing)
- [Coding Standards](#coding-standards)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a standard of respectful and inclusive behavior. Please be respectful of others and follow these basic principles:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/tree2dir.git
   cd tree2dir
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Add the original repository as a remote to keep your fork in sync:
   ```bash
   git remote add upstream https://github.com/solancer/tree2dir.git
   ```
5. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branches

- `main`: The main development branch. All PRs should target this branch.
- `feature/*`: Feature branches (e.g., `feature/add-yaml-support`).
- `fix/*`: Bug fix branches (e.g., `fix/windows-path-issue`).
- `docs/*`: Documentation-only changes (e.g., `docs/improve-readme`).

### Commits

- Use clear, concise commit messages
- Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
  - `feat: add support for YAML files`
  - `fix: resolve path issues on Windows`
  - `docs: update API documentation`
  - `test: add test for edge case with empty directories`
  - `chore: update dependencies`

### Pull Requests

1. Update your fork to the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a pull request from your branch to the `main` branch of the original repository
4. Provide a clear description of the changes, referencing any related issues
5. Wait for the CI checks to pass and address any feedback

## Testing

- Add tests for any new features or bug fixes
- Run the existing test suite to ensure you haven't broken anything:
  ```bash
  npm test
  ```
- Include both unit tests and end-to-end tests where appropriate

The project uses Jest for testing. Tests are located in the `tests/` directory.

## Coding Standards

- Follow the established code style
- Run linting before submitting your PR:
  ```bash
  npm run lint
  ```
- Use TypeScript for all new code
- Add type annotations for functions and variables
- Keep code modular and maintainable
- Add comments for complex logic

## Documentation

- Update documentation for any changes to the API or functionality
- Document new features with examples
- Keep the README.md up to date with new features
- Use JSDoc comments for functions and classes

## Issue Reporting

- Use the GitHub issue tracker
- Clearly describe the issue, including steps to reproduce for bugs
- Include relevant information like OS, Node.js version, etc.
- Tag issues appropriately (bug, enhancement, etc.)

## Feature Requests

- Open an issue describing the feature you'd like to see
- Explain why the feature would be useful
- Be open to discussion about different approaches

Thank you for contributing to tree2dir! 