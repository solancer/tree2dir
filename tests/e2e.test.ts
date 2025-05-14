import fs from 'fs';
import path from 'path';
import { generate } from '../src/commands/generate';
import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import os from 'os';

describe('tree2dir end-to-end tests', () => {
  // Create a temp directory for our tests
  const tempDir = path.join(os.tmpdir(), 'tree2dir-e2e-tests');
  
  beforeEach(() => {
    // Create a fresh test directory for each test
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    console.log(`Test temp directory: ${tempDir}`);
  });
  
  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
  
  // Test helper function to check if file exists and log details
  const checkFile = (filePath: string) => {
    const exists = fs.existsSync(filePath);
    if (!exists) {
      console.log(`File missing: ${filePath}`);
    }
    return exists;
  };
  
  test('should generate a basic directory structure', async () => {
    // Define a simple ASCII tree
    const asciiTree = `
project/
├── src/
│   ├── index.js
│   └── utils.js
└── package.json
`;
    
    // Generate the structure
    await generate(asciiTree, tempDir);
    
    // Verify the files and directories were created
    expect(checkFile(path.join(tempDir, 'project'))).toBe(true);
    expect(checkFile(path.join(tempDir, 'project', 'src'))).toBe(true);
    expect(checkFile(path.join(tempDir, 'project', 'src', 'index.js'))).toBe(true);
    expect(checkFile(path.join(tempDir, 'project', 'src', 'utils.js'))).toBe(true);
    expect(checkFile(path.join(tempDir, 'project', 'package.json'))).toBe(true);
  });
  
  test('should generate a complex directory structure with nested directories', async () => {
    // Define a simpler version of the complex ASCII tree to debug
    const asciiTree = `
complex-project/
├── src/
│   ├── components/
│   │   └── Button.tsx
│   ├── index.tsx
│   └── pages/
├── public/
│   └── favicon.ico
└── package.json
`;
    
    // Generate the structure
    await generate(asciiTree, tempDir);
    
    // List contents of temp directory for debugging
    const listDir = (dir: string, indent = '') => {
      if (!fs.existsSync(dir)) {
        console.log(`${indent}Directory does not exist: ${dir}`);
        return;
      }
      
      const items = fs.readdirSync(dir);
      console.log(`${indent}Contents of ${dir}:`);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          console.log(`${indent}- ${item}/`);
          listDir(itemPath, indent + '  ');
        } else {
          console.log(`${indent}- ${item}`);
        }
      }
    };
    
    listDir(tempDir);
    
    // Verify that directories were created
    const dirs = [
      'complex-project',
      'complex-project/src',
      'complex-project/src/components',
      'complex-project/src/pages',
      'complex-project/public'
    ];
    
    for (const dir of dirs) {
      const dirPath = path.join(tempDir, dir);
      expect(checkFile(dirPath)).toBe(true);
    }
    
    // Verify that files were created - fixing the path to match actual structure
    const files = [
      'complex-project/src/components/Button.tsx',
      'complex-project/src/index.tsx', // index.tsx is directly under src/, not under pages/
      'complex-project/public/favicon.ico',
      'complex-project/package.json'
    ];
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      expect(checkFile(filePath)).toBe(true);
    }
  });
  
  test('should handle special characters in file and directory names', async () => {
    const asciiTree = `
special-chars/
├── with spaces/
│   └── file with spaces.txt
├── with-dashes/
│   └── file-with-dashes.txt
└── with_underscores/
    └── file_with_underscores.txt
`;
    
    await generate(asciiTree, tempDir);
    
    expect(checkFile(path.join(tempDir, 'special-chars', 'with spaces', 'file with spaces.txt'))).toBe(true);
    expect(checkFile(path.join(tempDir, 'special-chars', 'with-dashes', 'file-with-dashes.txt'))).toBe(true);
    expect(checkFile(path.join(tempDir, 'special-chars', 'with_underscores', 'file_with_underscores.txt'))).toBe(true);
  });
  
  test('should respect the dry-run option without creating files', async () => {
    const asciiTree = `
dry-run/
└── file.txt
`;
    
    await generate(asciiTree, tempDir, { dryRun: true });
    
    // Verify that the files were NOT created
    expect(fs.existsSync(path.join(tempDir, 'dry-run'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'dry-run', 'file.txt'))).toBe(false);
  });
  
  test('should handle empty directories correctly', async () => {
    const asciiTree = `
empty-dirs/
├── empty1/
└── empty2/
`;
    
    await generate(asciiTree, tempDir);
    
    expect(checkFile(path.join(tempDir, 'empty-dirs', 'empty1'))).toBe(true);
    expect(checkFile(path.join(tempDir, 'empty-dirs', 'empty2'))).toBe(true);
    expect(fs.readdirSync(path.join(tempDir, 'empty-dirs', 'empty1'))).toHaveLength(0);
    expect(fs.readdirSync(path.join(tempDir, 'empty-dirs', 'empty2'))).toHaveLength(0);
  });
  
  test('should create correct directory structure when base folder is missing', async () => {
    const asciiTree = `
├── dir1/
│   └── file1.txt
└── dir2/
    └── file2.txt
`;
    
    await generate(asciiTree, tempDir);
    
    expect(checkFile(path.join(tempDir, 'dir1', 'file1.txt'))).toBe(true);
    expect(checkFile(path.join(tempDir, 'dir2', 'file2.txt'))).toBe(true);
  });
}); 