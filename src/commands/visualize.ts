import fs from 'fs';
import path from 'path';

type TreeNode = {
    name: string;
    type: 'file' | 'directory';
    children?: TreeNode[];
};

export function generateTreeStructure(dirPath: string): TreeNode {
    const stats = fs.statSync(dirPath);

    if (stats.isFile()) {
        return { name: path.basename(dirPath), type: 'file' };
    }

    const children = fs.readdirSync(dirPath).map(child =>
        generateTreeStructure(path.join(dirPath, child))
    );

    return {
        name: path.basename(dirPath),
        type: 'directory',
        children: children
    };
}

export function printTree(node: TreeNode, prefix: string = ''): void {
    console.log(prefix + (prefix ? '└── ' : '') + node.name);
    if (node.children) {
        const newPrefix = prefix + (prefix ? '│   ' : '');
        node.children.forEach(child => printTree(child, newPrefix));
    }
}
