# 🌳 tree2dir Platform

> **Transform ASCII tree representations into real directory structures**

A comprehensive platform ecosystem for directory structure management, evolved from a simple CLI tool into a full-featured monorepo with multiple packages and integrations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run the CLI
node dist/packages/cli/index.cjs --help

# Test with a simple tree
echo "myProject/
├── src/
│   ├── index.js
│   └── utils/
│       └── helpers.js
└── README.md" | node dist/packages/cli/index.cjs generate --dry-run
```

## 📦 Monorepo Structure

This project has been transformed into an Nx-powered monorepo with the following packages:

### Core Packages

- **`@tree2dir/core`** - Core functionality (ASCII parsing, validation, generation)
- **`@tree2dir/cli`** - Enhanced command-line interface
- **`@tree2dir/formats`** - File format handlers (.tree, JSON, YAML)
- **`@tree2dir/mcp-server`** - MCP server for LLM integration
- **`@tree2dir/vscode-extension`** - VS Code extension (planned)

### Package Dependencies

```
cli → core
formats → core
mcp-server → core
vscode-extension → core, formats
```

## 🛠️ Development

### Building

```bash
# Build all packages
npm run build

# Build specific package
npx nx run core:build
npx nx run cli:build

# Build with watch mode
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Test specific package
npx nx run core:test
```

### Linting

```bash
# Lint all packages
npm run lint

# Lint specific package
npx nx run core:lint
```

## 🎯 Platform Vision

### Phase 1: Core Platform Foundation ✅
- [x] Enhanced library architecture with TreeManager, TreeSerializer, EventSystem
- [x] Monorepo structure with Nx
- [x] Core functionality migration
- [x] CLI package with workspace dependencies
- [ ] .tree file format specification (YAML-based with metadata)
- [ ] Multiple format handlers (JSON, YAML, .tree)

### Phase 2: VS Code Extension (Planned)
- [ ] Visual tree editor with drag-and-drop interface
- [ ] Real-time ASCII preview
- [ ] Template library for common project types
- [ ] File association for .tree files

### Phase 3: MCP Server Integration (Planned)
- [ ] Tools for analyzing directory structures
- [ ] Natural language generation from descriptions
- [ ] LLM integration capabilities
- [ ] Template suggestions and validation

### Phase 4: Web Platform (Future)
- [ ] React/Next.js frontend
- [ ] Community template gallery
- [ ] Project management features

## 🔧 Current Status

**✅ Successfully Completed:**
- Nx monorepo structure with 5 packages
- Code migration from original tree2dir
- Package configuration and dependencies
- TypeScript configuration fixes
- Build system working for all packages
- CLI functionality preserved and enhanced

**🚧 In Progress:**
- .tree file format implementation
- MCP server functionality
- VS Code extension foundation

**📋 Next Steps:**
1. Implement .tree file format in formats package
2. Develop MCP server functionality
3. Create VS Code extension foundation
4. Add comprehensive examples and documentation

## 📖 Usage

### CLI Usage

The CLI maintains full backward compatibility with the original tree2dir:

```bash
# Generate from file
node dist/packages/cli/index.cjs generate -f tree.txt

# Generate from GitHub gist
node dist/packages/cli/index.cjs generate -g https://gist.github.com/username/gistid

# Interactive mode
node dist/packages/cli/index.cjs generate

# Dry run mode
node dist/packages/cli/index.cjs generate -f tree.txt --dry-run
```

### Programmatic Usage

```typescript
import { generate, parseAsciiTree, validateTree } from '@tree2dir/core';

// Generate directory structure
await generate(asciiTree, outputDir, { dryRun: false, debug: true });

// Parse and validate
const [nodes, baseFolder] = parseAsciiTree(asciiTree);
const validation = validateTree(nodes, baseFolder);
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/solancer/tree2dir)
- [Issues](https://github.com/solancer/tree2dir/issues)
- [Project Enhancements](PROJECT_ENHANCEMENTS.md)

---

**From CLI tool to platform ecosystem** - tree2dir has evolved into a comprehensive solution for directory structure management across multiple environments and use cases.



