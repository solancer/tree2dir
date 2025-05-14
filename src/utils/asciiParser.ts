import * as path from 'path';
import { removeComments } from "../utils/removeComments";
import os from 'os';

export type TreeNode = {
    name: string;
    type: 'directory' | 'file';
    children?: TreeNode[];
};

export type ValidationResult = {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};

// Constants for validation
const MAX_PATH_LENGTH = os.platform() === 'win32' ? 260 : 4096; // Windows MAX_PATH vs Unix
const RESERVED_NAMES = new Set(['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'LPT1', 'LPT2', 'LPT3', 'LPT4']);
const INVALID_CHARS = /[<>:"|?*\x00-\x1F]/; // Including control characters

/**
 * Validates a parsed tree structure for common issues.
 * @param nodes The parsed tree nodes
 * @param basePath The base path of the tree
 * @returns ValidationResult containing validation status and any errors/warnings
 */
export function validateTree(nodes: TreeNode[], basePath: string | null): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const paths = new Set<string>();
    const symlinks = new Set<string>();

    function validateNode(node: TreeNode, currentPath: string, depth: number = 0) {
        const fullPath = path.join(currentPath, node.name);
        
        // Check path length
        if (fullPath.length > MAX_PATH_LENGTH) {
            errors.push(`Path too long (${fullPath.length} > ${MAX_PATH_LENGTH}): ${fullPath}`);
        }

        // Check for duplicate paths
        if (paths.has(fullPath)) {
            errors.push(`Duplicate path found: ${fullPath}`);
        }
        paths.add(fullPath);

        // Check for empty node names
        if (!node.name.trim()) {
            errors.push(`Empty node name found at path: ${currentPath}`);
        }

        // Check for invalid characters in names
        if (INVALID_CHARS.test(node.name)) {
            errors.push(`Invalid characters in name: ${fullPath}`);
        }

        // Check for reserved names (Windows)
        if (os.platform() === 'win32' && RESERVED_NAMES.has(node.name.toUpperCase())) {
            errors.push(`Reserved name used: ${fullPath}`);
        }

        // Check for case sensitivity issues (macOS)
        if (os.platform() === 'darwin') {
            const lowerPath = fullPath.toLowerCase();
            if (symlinks.has(lowerPath)) {
                warnings.push(`Case sensitivity conflict: ${fullPath}`);
            }
            symlinks.add(lowerPath);
        }

        // Check for path traversal attempts
        if (node.name.includes('..') || node.name.includes('./')) {
            errors.push(`Path traversal attempt detected: ${fullPath}`);
        }

        // Check for deep nesting
        if (depth > 50) {
            warnings.push(`Deep nesting detected (depth ${depth}): ${fullPath}`);
        }

        // Validate directory structure
        if (node.type === 'directory') {
            if (!node.children || node.children.length === 0) {
                warnings.push(`Empty directory: ${fullPath}`);
            } else {
                node.children.forEach(child => validateNode(child, fullPath, depth + 1));
            }
        } else if (node.children && node.children.length > 0) {
            errors.push(`File cannot have children: ${fullPath}`);
        }
    }

    // Validate base path if provided
    if (basePath) {
        if (INVALID_CHARS.test(basePath)) {
            errors.push(`Invalid characters in base path: ${basePath}`);
        }
        if (basePath.includes('..') || basePath.includes('./')) {
            errors.push(`Path traversal attempt in base path: ${basePath}`);
        }
    }

    // Start validation from root
    nodes.forEach(node => validateNode(node, basePath || ''));

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Normalizes line endings and indentation in the ASCII tree.
 * @param asciiTree The ASCII tree as a string
 * @returns Normalized ASCII tree
 */
function normalizeTree(asciiTree: string): string {
    return asciiTree
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\t/g, '    ') // Convert tabs to spaces
        .replace(/[│├└─]/g, match => {
            // Normalize tree characters
            switch (match) {
                case '│': return '│';
                case '├': return '├';
                case '└': return '└';
                case '─': return '─';
                default: return match;
            }
        });
}

/**
 * Parses an ASCII representation of a directory/file tree with validation.
 * Supports various tree styles and indentation.
 * @param asciiTree The ASCII tree as a string.
 * @param debug Flag to control parser logging
 * @returns An array of TreeNode objects representing the tree.
 * @throws If the ASCII tree is empty or invalid.
 */
export function parseAsciiTree(asciiTree: string, debug: boolean = false): [TreeNode[], string | null] {
    if (!asciiTree.trim()) {
        throw new Error('The ASCII tree is empty.');
    }

    // Normalize the input
    const normalizedTree = normalizeTree(asciiTree);
    const lines = normalizedTree.trim().split('\n');
    
    if (debug) {
        console.log('Parsing ASCII Tree:', normalizedTree);
        console.log('Lines:', lines);
    }

    let baseFolder: string | null = null;
    const nodes: TreeNode[] = [];
    const stack: { node: TreeNode; level: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.replace(/\s+$/, ''); // Remove trailing spaces
        if (debug) {
            console.log(`Line ${i}: '${line}'`);
        }
        if (!line) continue;

        // Detect base folder (first line, no tree branch, ends with /)
        if (i === 0 && !/├──|└──/.test(line) && line.endsWith('/')) {
            baseFolder = line.slice(0, -1);
            continue;
        }

        // Skip lines that don't contain tree branches
        if (!/├──|└──/.test(line)) {
            continue;
        }

        // Calculate indentation level based on tree branch characters
        const indentMatch = line.match(/^(\s*)([│├└ ]*?)(├── |└── )/);
        if (!indentMatch) continue;

        const leadingSpaces = indentMatch[1].replace(/\t/g, '    ').length;
        const treeChars = indentMatch[2].replace(/[^│]/g, '').length;
        const level = Math.floor(leadingSpaces / 4) + treeChars;

        // Extract the node name
        const content = line.replace(/^\s*[│├└─ ]*(├── |└── )/, '');
        const isDirectory = content.endsWith('/');
        const nodeName = isDirectory ? content.slice(0, -1) : content;

        // Validate node name
        if (nodeName.includes('..') || nodeName.includes('./')) {
            throw new Error(`Path traversal attempt detected in node name: ${nodeName}`);
        }

        const node: TreeNode = {
            type: isDirectory ? 'directory' : 'file',
            name: nodeName,
            children: isDirectory ? [] : undefined
        };

        // Find parent by indentation level
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        if (stack.length === 0) {
            nodes.push(node);
        } else {
            const parent = stack[stack.length - 1].node;
            if (!parent.children) parent.children = [];
            parent.children.push(node);
        }

        if (isDirectory) {
            stack.push({ node, level });
        }
    }

    return [nodes, baseFolder];
}