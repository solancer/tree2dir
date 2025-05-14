#!/usr/bin/env node

import { generate } from './commands/generate';
import * as fs from 'fs';
import * as path from 'path';
import { fetchGistContent } from './utils/gistParser';

interface CliOptions {
    file?: string;
    gist?: string;
    output?: string;
    dryRun?: boolean;
    debug?: boolean;
}

function parseArgs(): CliOptions {
    const args = process.argv.slice(2);
    const options: CliOptions = {};
    let i = 0;

    while (i < args.length) {
        const arg = args[i];
        
        if (arg === 'generate') {
            // Skip the command name
            i++;
            continue;
        }

        if (arg.startsWith('--')) {
            const option = arg.slice(2);
            if (option === 'dry-run') {
                options.dryRun = true;
            } else if (option === 'debug') {
                options.debug = true;
            } else if (i + 1 < args.length) {
                const value = args[i + 1];
                switch (option) {
                    case 'file':
                        options.file = value;
                        break;
                    case 'gist':
                        options.gist = value;
                        break;
                    case 'output':
                        options.output = value;
                        break;
                }
                i++;
            }
        } else if (arg.startsWith('-')) {
            const option = arg.slice(1);
            if (i + 1 < args.length) {
                const value = args[i + 1];
                switch (option) {
                    case 'f':
                        options.file = value;
                        break;
                    case 'g':
                        options.gist = value;
                        break;
                    case 'o':
                        options.output = value;
                        break;
                }
                i++;
            }
        }
        i++;
    }

    return options;
}

async function main() {
    const options = parseArgs();
    const isInteractive = process.stdin.isTTY && !options.file && !options.gist;

    try {
        if (isInteractive) {
            console.log('Enter your ASCII tree structure (press Ctrl+D when done):');
            let input = '';
            process.stdin.setEncoding('utf8');
            
            for await (const chunk of process.stdin) {
                input += chunk;
            }

            if (!input.trim()) {
                console.error('Error: No input provided');
                process.exit(1);
            }

            await generate(input, options.output || '.', { interactive: true, debug: options.debug });
        } else if (options.file) {
            const filePath = path.resolve(options.file);
            if (!fs.existsSync(filePath)) {
                console.error(`Error: File not found: ${filePath}`);
                process.exit(1);
            }

            const content = fs.readFileSync(filePath, 'utf8');
            await generate(content, options.output || '.', { 
                dryRun: options.dryRun,
                debug: options.debug,
                interactive: true
            });
        } else if (options.gist) {
            try {
                const content = await fetchGistContent(options.gist);
                await generate(content, options.output || '.', { 
                    dryRun: options.dryRun,
                    debug: options.debug,
                    interactive: true
                });
            } catch (error) {
                console.error('Error fetching gist:', error);
                process.exit(1);
            }
        } else {
            console.log('Usage:');
            console.log('  tree2dir generate -f <file> [-o <output>] [--dry-run] [--debug]');
            console.log('  tree2dir generate -g <gist-url> [-o <output>] [--dry-run] [--debug]');
            console.log('  tree2dir generate (interactive mode)');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
