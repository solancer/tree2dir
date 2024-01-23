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
	<br>
	<br>
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

## Installation
`tree2dir` can be installed globally via npm:

```bash
npm install -g tree2dir
```

Or, for a one-time use without installation, you can use `npx`:

```bash
tree2dir generate
```

## Usage
## General Command

To start `tree2dir` in interactive mode, simply run:

```bash
tree2dir generate
```
Then paste your ASCII tree and press Ctrl+D when finished.


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

## Large Language Models (LLM) Integration
`tree2dir` can be especially useful when combined with LLMs for generating directory structures. LLMs can be prompted to create an ASCII representation of a project structure, which tree2dir can then turn into an actual directory setup.

## Scenarios Of Use

 - Rapid Prototyping: Quickly create boilerplate structures for new projects.
 - Educational Tools: Teach file system structures in a visual and interactive way.
 - Project Templates: Easily replicate complex project structures for consistency across multiple projects.


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
## Usage
Here's how to use tree2dir to generate directory structures within your application:

```js
const tree2dir = require('tree2dir');

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
tree2dir.generate(asciiTree)
  .then(() => {
    console.log('Directory structure has been successfully created!');
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });

```

## Async/Await
If you're using modern JavaScript with async/await, the usage becomes even cleaner:
```js
const tree2dir = require('tree2dir');

async function createProjectStructure() {
  try {
    const asciiTree = `
    myProject/
    ├── README.md
    ├── src/
    │   ├── main.js
    │   └── utils/
    │       └── helpers.js
    └── package.json
    `;

    // Generate the directory structure
    await tree2dir.generate(asciiTree);
    console.log('Directory structure has been successfully created!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

createProjectStructure();
```

## TypeScript
If you're using TypeScript, tree2dir provides type definitions out of the box. Here's how you might use it in a TypeScript application:

```ts
import { generate } from 'tree2dir';

async function createProjectStructure() {
  const asciiTree: string = `
  myProject/
  ├── README.md
  ├── src/
  │   ├── main.ts
  │   └── utils/
  │       └── helpers.ts
  └── package.json
  `;

  try {
    // Generate the directory structure
    await generate(asciiTree);
    console.log('Directory structure has been successfully created!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

createProjectStructure();
```

## Advanced Usage: Accepting ASCII Trees from Streams

In addition to passing a static ASCII tree string to `tree2dir`, you can also process ASCII trees from streams. This is particularly useful when you're dealing with large directories or when you want to generate structures on-the-fly from an external source.

Here's an example of how you might accept an ASCII tree from a readable stream:

```javascript
const tree2dir = require('tree2dir');
const { Readable } = require('stream');

function streamToTree2dir(stream) {
  let asciiTree = '';
  
  stream.on('data', chunk => {
    asciiTree += chunk;
  });

  stream.on('end', async () => {
    try {
      await tree2dir.generate(asciiTree);
      console.log('Directory structure has been successfully created!');
    } catch (error) {
      console.error('An error occurred while generating structure:', error);
    }
  });
}

// Example usage with a Readable stream
const treeStream = Readable.from(`
myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json
`);

streamToTree2dir(treeStream);
```

## Using with TypeScript
If you're using TypeScript, the example would look similar, with the addition of types for better code reliability and developer experience:

```ts
import { generate } from 'tree2dir';
import { Readable } from 'stream';

function streamToTree2dir(stream: Readable) {
  let asciiTree: string = '';
  
  stream.on('data', (chunk: Buffer) => {
    asciiTree += chunk.toString();
  });

  stream.on('end', async () => {
    try {
      await generate(asciiTree);
      console.log('Directory structure has been successfully created!');
    } catch (error) {
      console.error('An error occurred while generating structure:', error);
    }
  });
}

// Example usage with a Readable stream
const treeStream: Readable = Readable.from(`
myProject/
├── README.md
├── src/
│   ├── main.ts
│   └── utils/
│       └── helpers.ts
└── package.json
`);

streamToTree2dir(treeStream);
```

By incorporating tree2dir into your Node.js applications, you gain the flexibility to programmatically create file structures, which can be particularly useful for scaffolding projects, generating reports, or organizing output data.


## Contributing
Contributions to tree2dir are welcome. Please fork the repository, make your changes, and submit a pull request.

## License
tree2dir is open-source software licensed under the MIT License.