import { removeComments } from "../utils/removeComments";

export type TreeNode = {
    name: string;
    type: 'directory' | 'file';
    children?: TreeNode[];
};

/**
 * Parses an ASCII representation of a directory/file tree with validation.
 * 
 * @param asciiTree The ASCII tree as a string.
 * @returns An array of TreeNode objects representing the tree.
 * @throws If the ASCII tree is invalid.
 */
export function parseAsciiTree(asciiTree: string): [TreeNode[], string | null] {
    console.log('Parsing ASCII Tree:', asciiTree);

    if (!asciiTree.trim()) throw new Error('The ASCII tree is empty.');

    const lines = asciiTree.split('\n').map(removeComments).filter(Boolean);

    console.log('Lines:', lines);

    let rootNodes: TreeNode[] = [];
    let nodeStack: { level: number; node: TreeNode }[] = [];
    let basePath: string | null = null;

    if (lines[0].endsWith('/')) {
        basePath = (lines.shift()?.trim().replace(/\/$/, '')) ?? ''; // Add fallback to empty string
    }

    lines.forEach((line, index) => {
        console.log(`Line ${index}: '${line}'`);

        // Skip lines that do not represent a file or directory
        if (!line.match(/(├──|└──)/) && line.trim() !== '│') {
            return;
        }

        if (line.trim().endsWith('..')) {
            return;
        }

        const level = line.search(/├──|└──/) / 4;

        // Determine if the current line represents a directory
        const nextLine = lines[index + 1] || '';
        const nextLineLevel = nextLine.search(/├──|└──/) / 4;
        const isDirectory = nextLineLevel > level;

        const name = line.replace(/(├── |└── |│   )/g, '').trim();

        console.log(`Level: ${level}, Name: ${name}, IsDirectory: ${isDirectory}`);

        const node: TreeNode = {
            name,
            type: isDirectory ? 'directory' : 'file',
            children: isDirectory ? [] : undefined,
        };

        console.log(`Created Node:`, node);

        if (nodeStack.length === 0 || level === 0) {
            rootNodes.push(node);
            nodeStack = [{ level, node }];
        } else {
            while (nodeStack.length && nodeStack[nodeStack.length - 1].level >= level) {
                nodeStack.pop();
            }

            if (nodeStack.length) {
                const parentNode = nodeStack[nodeStack.length - 1].node;
                parentNode.children = parentNode.children || [];
                parentNode.children.push(node);
            } else {
                throw new Error(`No parent node found for line: "${line}"`);
            }

            nodeStack.push({ level, node });
        }
    });

    console.log('Final Parsed Tree Structure:', rootNodes);
    return [rootNodes, basePath];
}