<div align="center">
	<br>
	<a href="https://tree2dir.solancer.com">
		<img src="Stuff/tree2dir-logo.png" width="200" height="200">
	</a>
	<h1>tree2dir</h1>
	<p>
		<b>Directory And File Structure Generator</b>
	</p>
    <a href="https://github.com/solancer/tree2dir/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/solancer/tree2dir" alt="GitHub license">
    </a>
    <a href="https://github.com/solancer/tree2dir/issues">
        <img src="https://img.shields.io/github/issues/solancer/tree2dir" alt="GitHub issues">
    </a>
    <a href="https://github.com/solancer/tree2dir/network">
        <img src="https://img.shields.io/github/forks/solancer/tree2dir" alt="GitHub forks">
    </a>
    <a href="https://github.com/solancer/tree2dir/stargazers">
        <img src="https://img.shields.io/github/stars/solancer/tree2dir" alt="GitHub stars">
    </a>
    <a href="https://github.com/solancer/tree2dir/actions/workflows/ci.yml">
        <img src="https://github.com/solancer/tree2dir/actions/workflows/ci.yml/badge.svg" alt="CI">
    </a>
    <br>
    <a href="https://www.npmjs.com/package/tree2dir">
        <img src="https://img.shields.io/npm/v/tree2dir" alt="npm version">
    </a>
    <a href="https://www.npmjs.com/package/tree2dir">
        <img src="https://img.shields.io/npm/dt/tree2dir" alt="npm downloads">
    </a>
    <a href="https://www.npmjs.com/package/tree2dir">
        <img src="https://img.shields.io/npm/dw/tree2dir" alt="npm weekly downloads">
    </a>
    <a href="https://www.npmjs.com/package/tree2dir">
        <img src="https://img.shields.io/npm/types/tree2dir" alt="npm type definitions">
    </a>
    <a href="https://www.npmjs.com/package/tree2dir">
        <img src="https://img.shields.io/npm/l/tree2dir" alt="npm license">
    </a>
	<br>
	<br>
	<div>
		<img src="Stuff/tree2dir-demo.gif" width="600" alt="tree2dir CLI demo">
	</div>
	<br>
</div>

---

## Overview

`tree2dir` is a powerful Command Line Interface (CLI) tool designed to simplify the process of creating complex directory structures. It allows users to generate an entire file and folder structure from an ASCII tree representation. This can be incredibly useful for quickly setting up project structures, replicating folder structures, or even for educational purposes.

## Features
- **Generate from ASCII Tree:** Create a directory structure from a simple ASCII representation.
- **File Input:** Support for reading ASCII trees from `.txt` files.
- **GitHub Gist Support:** Fetch and generate structures directly from GitHub gists.
- **Interactive Mode:** Paste your ASCII tree directly into the command line.
- **Output Directory:** Specify a custom output directory for generated structures.
- **Dry Run Mode:** Preview the structure without creating any files.
- **Validation:** Automatic validation of tree structure with helpful error messages.
- **Special Character Support:** Handles filenames with spaces, dashes, and underscores.

## Quick Start with npx

The fastest way to use `tree2dir` without installation:

```bash
npx tree2dir generate
```

Follow the interactive prompts to paste your ASCII tree structure and generate the directories and files.

## Installation

### Global Installation
Install `tree2dir` globally to use it from anywhere:

```bash
npm install -g tree2dir
```

### Local Installation
For project-specific use:

```bash
npm install tree2dir --save-dev
```

## Usage
### General Command

To start `tree2dir` in interactive mode, simply run:

```bash
tree2dir generate
```

### Options

- **`-f, --file <path>`**: Path to an ASCII tree file.
  ```bash
  tree2dir generate -f mytree.txt
  ```

- **`-g, --gist <gistUrl>`**: URL of a GitHub gist containing the ASCII tree.
  ```bash
  tree2dir generate -g https://gist.github.com/username/gistid
  ```

- **`-o, --output <dir>`**: Specify the output directory (default: current directory).
  ```bash
  tree2dir generate -f mytree.txt -o ./outdir
  ```

- **`--dry-run`**: Visualize the structure without creating files.
  ```bash
  tree2dir generate -f mytree.txt --dry-run
  ```

- **`-v, --version`**: Display the current version of tree2dir.
  ```bash
  tree2dir --version
  ```

- **`-h, --help`**: Show help and usage information.
  ```bash
  tree2dir --help
  ```

### Examples

1. Generate a structure from a file in a custom output directory:
```bash
tree2dir generate -f mytree.txt -o ./my-project
```

2. Preview a structure without creating files:
```bash
tree2dir generate -f mytree.txt --dry-run
```

3. Generate from a GitHub gist with dry run:
```bash
tree2dir generate -g <gist-url> --dry-run
```

4. Quick one-time use with npx:
```bash
npx tree2dir generate -f mytree.txt -o ./my-project
```

## From a File
To generate a structure from a file:

```bash
tree2dir generate --file <path-to-your-file>
```

### For example:
```bash
tree2dir generate --file ./my-ascii-tree.txt
```

## From a GitHub Gist
To generate a structure from a GitHub gist:

```bash
tree2dir generate --gist <gist-url>
```

### For example:

```bash
tree2dir generate --gist https://gist.github.com/solancer/147dbff070d5424283f2f69be23bd8d6
```


## ASCII Tree Format
### The ASCII tree should follow a simple format, for example:

```
myProject/
├── README.md
├── src/
│   ├── main.js
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── shared/
│   │       ├── Button.js
│   │       └── Slider.js
│   └── utils/
│       ├── helpers.js
│       └── test/
│           ├── helper.test.js
│           └── mockData.js
├── lib/
│   ├── middleware.js
│   └── database.js
├── tests/
│   ├── main.test.js
│   └── components/
│       ├── Header.test.js
│       └── Footer.test.js
└── package.json
```

### Validation Rules

The tool performs several validations on the ASCII tree:

1. **Duplicate Paths**: Detects and prevents duplicate file/directory paths.
2. **Invalid Characters**: Checks for invalid characters in filenames (e.g., `:`).
3. **Empty Directories**: Warns about empty directories in the structure.
4. **Path Validation**: Ensures all paths are valid for the target operating system.

### Special Character Support

The tool supports various special characters in filenames:

- Spaces: `file with spaces.js`
- Dashes: `file-with-dashes.js`
- Underscores: `file_with_underscores.js`

## Large Language Models (LLM) Integration
`tree2dir` can be especially useful when combined with LLMs for generating directory structures. LLMs can be prompted to create an ASCII representation of a project structure, which tree2dir can then turn into an actual directory setup.

## Scenarios Of Use

- Rapid Prototyping: Quickly create boilerplate structures for new projects.
- Educational Tools: Teach file system structures in a visual and interactive way.
- Project Templates: Easily replicate complex project structures for consistency across multiple projects.
- AI-assisted Project Setup: Generate project structures using AI tools like ChatGPT or Claude.


## Using `tree2dir` as a Library in Node.js Applications

While `tree2dir` is primarily a CLI tool, it can also be used programmatically within your Node.js applications. This allows you to generate directory structures dynamically based on your needs.

### Installation

First, install `tree2dir` as a dependency in your project:

```bash
npm install tree2dir --save
```

Or, if you are using Yarn:

```bash
yarn add tree2dir
```

### Usage
Here's how to use tree2dir to generate directory structures within your application:

```js
const { generate } = require('tree2dir');

// Define your ASCII tree as a string
const asciiTree = `
myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json
`;

// Use the `generate` function to create the structure
generate(asciiTree, './output', { dryRun: false })
  .then(() => {
    console.log('Directory structure has been successfully created!');
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
```

### API Reference

The library exports the following functions:

#### `generate(asciiTree: string, basePath: string, options?: { dryRun?: boolean }): Promise<void>`

- `asciiTree`: The ASCII tree structure as a string
- `basePath`: The base directory where the structure will be created
- `options`: Optional configuration

## Why Use tree2dir?

- **Save Time**: Quickly scaffold project structures without manually creating each file and folder.
- **Consistency**: Ensure consistent project structures across teams or multiple projects.
- **Visualization**: The ASCII tree format makes it easy to visualize and understand directory structures.
- **Integration**: Works well with other tools and workflows, including AI assistants and code generators.

## Contributing

Contributions are welcome! Here's how you can contribute to the project:

1. **Fork the repository**: Create your own fork of the project.
2. **Create a branch**: Create a branch for your feature or fix.  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**: Implement your changes, following the code style of the project.
4. **Run the tests**: Make sure all tests pass with your changes.  
   ```bash
   npm test
   ```
5. **Run linting**: Ensure your code meets our linting standards.  
   ```bash
   npm run lint
   ```
6. **Submit a pull request**: Push your changes to your fork and submit a pull request to the main repository.

See the [CHANGELOG.md](CHANGELOG.md) file for details on the latest changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

* Special thanks to all contributors who have helped make this project better.
* ASCII tree parsing was inspired by various text-based tree visualization techniques.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/solancer">Srinivas Gowda</a></p>
  <p>
    <a href="https://www.npmjs.com/package/tree2dir">
      <img src="https://nodei.co/npm/tree2dir.png?downloads=true&downloadRank=true&stars=true" alt="NPM">
    </a>
  </p>
</div>







```
otelcol.receiver.filelog "bridge_pm2" {
  include       = ["/home/ubuntu/logs/pcs-combined.log"]
  start_at      = "end"
  poll_interval = "250ms"
  output.logs   = [loki.process.bridge.receiver]
}

loki.process "bridge" {
  forward_to = [loki.write.gc.receiver]

loki.write "gc" {
  endpoint {
    url       = env("GCLOUD_HOSTED_LOGS_URL")
    tenant_id = env("GCLOUD_HOSTED_LOGS_ID")
    basic_auth {
      username = env("GCLOUD_HOSTED_LOGS_ID")
      password = env("GCLOUD_RW_API_KEY")
    }
  }
}
```

