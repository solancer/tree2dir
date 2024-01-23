import fs from 'fs';
import path from 'path';
import { parseAsciiTree } from '../utils/asciiParser';

// Define a type for tree nodes
type TreeNode = {
    type: 'file' | 'directory';
    name: string;
    children?: TreeNode[];
};

/**
 * Create directories and files based on the TreeNode structure.
 * @param basePath The base path where the tree will start.
 * @param treeNodes The tree structure representing the ASCII tree.
 */
async function createStructure(basePath: string, treeNodes: TreeNode[], baseFolder: string | null): Promise<void> {
    console.log('Creating Filesystem Structure at BasePath:', basePath);

    // Check and create the base folder if it doesn't exist
    if (baseFolder) {
        const baseDirPath = path.join(basePath, baseFolder);
        if (!fs.existsSync(baseDirPath)) {
            await fs.promises.mkdir(baseDirPath, { recursive: true });
        }
        basePath = baseDirPath; // Update basePath to include the baseFolder
    }

    for (const node of treeNodes) {
        // Join the basePath with the node's name
        const fullPath = path.join(basePath, node.name);
        console.log(`Processing node: ${node.name}, Type: ${node.type}, Path: ${fullPath}`);

        // Create file or directory based on the node type
        if (node.type === 'file') {
            console.log(`Creating file at: ${fullPath}`);
            await fs.promises.writeFile(fullPath, '');
        } else if (node.type === 'directory') {
            console.log(`Creating directory at: ${fullPath}`);
            if (!fs.existsSync(fullPath)) {
                await fs.promises.mkdir(fullPath, { recursive: true });
            }
        }

        // Recursively create structure for children nodes
        if (node.children) {
            await createStructure(fullPath, node.children, null); // Pass 'null' for baseFolder in recursive calls
        }
    }
}

/**
 * The generate function to be exported and used in index.ts.
 * It should parse the ASCII input and generate the directory structure.
 * @param asciiInput The ASCII tree input as a string.
 */
export async function generate(asciiInput: string): Promise<void> {
    const [treeNodes, baseFolder] = parseAsciiTree(asciiInput);
    const basePath = process.cwd();

    await createStructure(basePath, treeNodes, baseFolder);
}

