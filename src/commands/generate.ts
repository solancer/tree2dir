import { parseAsciiTree, validateTree } from '../utils/asciiParser';
import * as fs from 'fs';
import * as path from 'path';
import fsPromises from 'fs/promises';
import os from 'os';

// For testing purposes
export const errorCodes = {
  ENOSPC: 'ENOSPC: no space left on device',
  EDQUOT: 'EDQUOT: disk quota exceeded',
  TEST_ERROR: 'Test error'
};

// Flag to enable test mode (only set in test environment)
let testMode = false;

// Function to enable test mode for error handling
export function enableTestMode() {
    testMode = true;
}

// Function to disable test mode
export function disableTestMode() {
    testMode = false;
}

// Define a type for tree nodes
type TreeNode = {
    type: 'file' | 'directory';
    name: string;
    children?: TreeNode[];
};

interface GenerateOptions {
    dryRun?: boolean;
    debug?: boolean;
    interactive?: boolean;
    maxConcurrent?: number;
}

class LoadingIndicator {
    private message: string;
    private dots: number;
    private interval: NodeJS.Timeout | null;
    private isRunning: boolean;

    constructor(message: string) {
        this.message = message;
        this.dots = 0;
        this.interval = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log(this.message);
        this.interval = setInterval(() => {
            this.dots = (this.dots + 1) % 4;
            process.stdout.write(`\r${this.message}${'.'.repeat(this.dots)}`);
        }, 500);
    }

    stop(success: boolean = true) {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        process.stdout.write('\r' + ' '.repeat(this.message.length + 3) + '\r');
        if (success) {
            console.log('✓ Directory structure generated successfully!');
        } else {
            console.log('✗ Failed to generate directory structure');
        }
    }
}

// Helper function to handle error recognition for tests
function handleTestError(error: unknown): never {
    if (error instanceof Error) {
        // Check for test error messages
        if ([errorCodes.ENOSPC, errorCodes.EDQUOT, errorCodes.TEST_ERROR].includes(error.message)) {
            console.error(`TEST ERROR DETECTED: ${error.message}`);
            
            // In test mode, keep the original error message
            if (testMode) {
                throw error;
            }
        }
    }
    throw error;
}

/**
 * Safely creates a directory with proper error handling
 */
async function safeMkdir(dirPath: string, debug: boolean = false): Promise<void> {
    try {
        await fsPromises.mkdir(dirPath, { recursive: true, mode: 0o755 });
    } catch (error) {
        if (debug) {
            console.error(`Error creating directory ${dirPath}:`, error);
        }
        // Preserve original error without modification
        handleTestError(error);
    }
}

/**
 * Safely creates a file with proper error handling
 */
async function safeWriteFile(filePath: string, content: string = '', debug: boolean = false): Promise<void> {
    try {
        const dirPath = path.dirname(filePath);
        await fsPromises.mkdir(dirPath, { recursive: true, mode: 0o755 });
        await fsPromises.writeFile(filePath, content, { mode: 0o644 });
    } catch (error) {
        if (debug) {
            console.error(`Error creating file ${filePath}:`, error);
        }
        // Preserve original error without modification
        handleTestError(error);
    }
}

/**
 * Process nodes in parallel with a concurrency limit
 */
async function processNodes(
    nodes: TreeNode[],
    basePath: string,
    options: { debug: boolean; maxConcurrent: number }
): Promise<void> {
    const { debug, maxConcurrent } = options;
    const queue = [...nodes];
    const processing = new Set<Promise<void>>();

    while (queue.length > 0 || processing.size > 0) {
        // Fill up to maxConcurrent promises
        while (queue.length > 0 && processing.size < maxConcurrent) {
            const node = queue.shift()!;
            const promise = (async () => {
                const nodePath = path.join(basePath, node.name);
                if (debug) {
                    console.log(`Processing node: ${node.name}, Type: ${node.type}, Path: ${nodePath}`);
                }

                if (node.type === 'directory') {
                    await safeMkdir(nodePath, debug);
                    if (node.children) {
                        await processNodes(node.children, nodePath, options);
                    }
                } else {
                    if (debug) {
                        console.log(`Creating file at: ${nodePath}`);
                    }
                    await safeWriteFile(nodePath, '', debug);
                }
            })();
            processing.add(promise);
            promise.finally(() => processing.delete(promise));
        }

        // Wait for at least one promise to complete
        if (processing.size > 0) {
            try {
                await Promise.race(processing);
            } catch (error) {
                handleTestError(error);
            }
        }
    }
}

/**
 * Generate directory structure from ASCII tree
 */
export async function generate(
    asciiTree: string,
    outputDir: string,
    options: GenerateOptions = {}
): Promise<void> {
    const {
        dryRun = false,
        debug = false,
        interactive = false,
        maxConcurrent = os.cpus().length
    } = options;

    const loader = interactive ? new LoadingIndicator('Generating directory structure...') : null;

    try {
        if (loader) loader.start();

        // Parse and validate the ASCII tree
        const [nodes, baseFolder] = parseAsciiTree(asciiTree, debug);
        const validation = validateTree(nodes, baseFolder);

        if (!validation.isValid) {
            const errorMessage = validation.errors.join('\n');
            throw new Error(`Validation failed:\n${errorMessage}`);
        }

        if (validation.warnings.length > 0) {
            console.warn('Warnings:');
            validation.warnings.forEach(warning => console.warn(`- ${warning}`));
        }

        const basePath = path.join(outputDir, baseFolder || '');

        if (debug) {
            console.log(`Creating Filesystem Structure at BasePath: ${basePath}`);
        }

        if (dryRun) {
            console.log('Dry Run: The following structure would be created:');
            if (debug) {
                // Print debug info for each node in dry run mode
                nodes.forEach(node => {
                    console.log(`Processing node: ${node.name}, Type: ${node.type}, Path: ${path.join(basePath, node.name)}`);
                });
            }
            printTree(nodes, baseFolder, outputDir);
            return;
        }

        // Create the base directory
        await safeMkdir(basePath, debug);

        // Process nodes with concurrency control
        await processNodes(nodes, basePath, { debug, maxConcurrent });

        if (loader) loader.stop(true);
    } catch (error) {
        if (loader) loader.stop(false);
        // Preserve original error without modification
        handleTestError(error);
    }
}

/**
 * Print tree structure for dry run
 */
function printTree(nodes: TreeNode[], baseFolder: string | null, outputDir: string): void {
    function printNode(node: TreeNode, level: number = 0): void {
        const indent = '    '.repeat(level);
        const prefix = level === 0 ? '' : (level === 1 ? '└── ' : '    └── ');
        console.log(`${indent}${prefix}${node.name}${node.type === 'directory' ? '/' : ''}`);
        if (node.children) {
            node.children.forEach(child => printNode(child, level + 1));
        }
    }

    if (baseFolder) {
        console.log(`${baseFolder}/`);
    }
    nodes.forEach(node => printNode(node));
}

