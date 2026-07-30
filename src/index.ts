#!/usr/bin/env node

import { generate } from './commands/generate';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { fetchGistContent } from './utils/gistParser';

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

interface CliOptions {
    file?: string;
    gist?: string;
    output?: string;
    dryRun?: boolean;
    debug?: boolean;
    help?: boolean;
    skip?: boolean;
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
            } else if (option === 'help') {
                options.help = true;
            } else if (option === 'skip') {
                options.skip = true;
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
            if (option === 'h') {
                options.help = true;
            } else if (option === 's') {
                options.skip = true;
            } else if (i + 1 < args.length) {
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

function displayHelp(): void {
    console.log(`\n${colors.bright}${colors.green}🌳 tree2dir - Directory Structure Generator ${colors.reset}v1.2.0\n`);
    
    console.log(`${colors.bright}${colors.cyan}Usage:${colors.reset}`);
    console.log(`  ${colors.yellow}tree2dir${colors.reset} [options]`);
    console.log(`  ${colors.yellow}tree2dir generate${colors.reset} [options]`);
    
    console.log(`\n${colors.bright}${colors.cyan}Options:${colors.reset}`);
    console.log(`  ${colors.green}-f, --file${colors.reset} <path>      📄 Path to an ASCII tree file`);
    console.log(`  ${colors.green}-g, --gist${colors.reset} <gistUrl>   🔗 URL of a GitHub gist containing the ASCII tree`);
    console.log(`  ${colors.green}-o, --output${colors.reset} <dir>     📁 Specify the output directory (default: current directory)`);
    console.log(`  ${colors.green}--dry-run${colors.reset}              🔍 Visualize the structure without creating files`);
    console.log(`  ${colors.green}--debug${colors.reset}                🐞 Show debug information during execution`);
    console.log(`  ${colors.green}-s, --skip${colors.reset}             ⏭️  Skip existing files and directories`);
    console.log(`  ${colors.green}-h, --help${colors.reset}             ℹ️  Show this help message`);
    
    console.log(`\n${colors.bright}${colors.cyan}Examples:${colors.reset}`);
    console.log(`  ${colors.yellow}tree2dir generate -f mytree.txt -o ./my-project${colors.reset}`);
    console.log(`  ${colors.yellow}tree2dir generate -g https://gist.github.com/username/gistid --dry-run${colors.reset}`);
    console.log(`  ${colors.yellow}tree2dir generate -f mytree.txt -s${colors.reset}`);
    console.log(`  ${colors.yellow}tree2dir generate${colors.reset}      (interactive mode)`);
    
    console.log(`\n${colors.dim}For more information, visit: https://github.com/solancer/tree2dir${colors.reset}\n`);
}

// Sample tree template for interactive mode
const sampleTreeTemplate = `myProject/
├── README.md
├── src/
│   ├── index.js
│   ├── components/
│   │   └── App.js
│   └── utils/
│       └── helpers.js
└── package.json`;

// Display a multi-line ASCII art banner
function displayBanner(): void {
    console.log(`${colors.green}
    ████████╗██████╗ ███████╗███████╗██████╗ ██████╗ ██╗██████╗ 
    ╚══██╔══╝██╔══██╗██╔════╝██╔════╝╚════██╗██╔══██╗██║██╔══██╗
       ██║   ██████╔╝█████╗  █████╗   █████╔╝██║  ██║██║██████╔╝
       ██║   ██╔══██╗██╔══╝  ██╔══╝  ██╔═══╝ ██║  ██║██║██╔══██╗
       ██║   ██║  ██║███████╗███████╗███████╗██████╔╝██║██║  ██║
       ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝
                                                                 ${colors.reset}
    ${colors.bright}${colors.yellow}🌳 Generate Directory Structures from ASCII Trees${colors.reset}
    `);
}

// Function to handle interactive mode with better UX
async function handleInteractiveMode(outputDir: string, options: { debug?: boolean }): Promise<void> {
    displayBanner();
    
    console.log(`\n${colors.cyan}Welcome to interactive mode!${colors.reset}\n`);
    console.log(`${colors.bright}${colors.white}You can paste or type your ASCII tree structure below.${colors.reset}`);
    console.log(`${colors.dim}Example format:${colors.reset}\n`);
    console.log(`${colors.yellow}${sampleTreeTemplate}${colors.reset}\n`);
    
    console.log(`${colors.cyan}${colors.bright}Instructions:${colors.reset}`);
    console.log(`${colors.white}1. Type or paste your ASCII tree structure below${colors.reset}`);
    console.log(`${colors.white}2. Press ${colors.bright}Ctrl+D${colors.reset}${colors.white} (Unix/Mac) or ${colors.bright}Ctrl+Z${colors.reset}${colors.white} followed by Enter (Windows) when finished${colors.reset}`);
    console.log(`${colors.white}3. To cancel at any time, press ${colors.bright}Ctrl+C${colors.reset}\n`);
    
    console.log(`${colors.green}🌳 Enter your tree structure below:${colors.reset}\n`);
    
    let input = '';
    process.stdin.setEncoding('utf8');
    
    // Create a progress indicator
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let spinnerIdx = 0;
    let spinnerInterval: NodeJS.Timeout | null = null;
    
    // Collect input
    for await (const chunk of process.stdin) {
        input += chunk;
    }
    
    if (!input.trim()) {
        console.error(`${colors.red}❌ Error: No input provided${colors.reset}`);
        process.exit(1);
    }
    
    console.log('\n');
    
    // Start spinner animation
    const startSpinner = () => {
        let message = 'Generating directory structure';
        spinnerInterval = setInterval(() => {
            process.stdout.write(`\r${colors.cyan}${spinner[spinnerIdx]} ${message}${'.'.repeat(spinnerIdx % 4)}${' '.repeat(4 - (spinnerIdx % 4))}${colors.reset}`);
            spinnerIdx = (spinnerIdx + 1) % spinner.length;
        }, 80);
    };
    
    // Stop spinner animation
    const stopSpinner = () => {
        if (spinnerInterval) {
            clearInterval(spinnerInterval);
            spinnerInterval = null;
        }
        process.stdout.write(`\r${colors.green}✓ Directory structure generated successfully!${' '.repeat(40)}\n${colors.reset}`);
    };
    
    try {
        startSpinner();
        await generate(input, outputDir, { interactive: true, debug: options.debug });
        stopSpinner();
        
        console.log(`\n${colors.green}🎉 All done! Your directory structure has been created in: ${colors.bright}${outputDir}${colors.reset}\n`);
    } catch (error) {
        if (spinnerInterval) {
            clearInterval(spinnerInterval);
        }
        console.error(`\n${colors.red}❌ Error:${colors.reset}`, error);
        process.exit(1);
    }
}

async function main() {
    const options = parseArgs();
    
    // Handle help flag first
    if (options.help) {
        displayHelp();
        return;
    }
    
    const isInteractive = process.stdin.isTTY && !options.file && !options.gist;

    try {
        if (isInteractive) {
            await handleInteractiveMode(options.output || '.', { debug: options.debug });
        } else if (options.file) {
            const filePath = path.resolve(options.file);
            if (!fs.existsSync(filePath)) {
                console.error(`${colors.red}❌ Error: File not found: ${filePath}${colors.reset}`);
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
                console.error(`${colors.red}❌ Error fetching gist:${colors.reset}`, error);
                process.exit(1);
            }
        } else {
            console.log(`${colors.bright}${colors.green}🌳 tree2dir - Directory Structure Generator ${colors.reset}\n`);
            
            console.log(`${colors.bright}${colors.cyan}Usage:${colors.reset}`);
            console.log(`  ${colors.yellow}tree2dir generate -f <file>${colors.reset} [-o <output>] [--dry-run] [--debug]`);
            console.log(`  ${colors.yellow}tree2dir generate -g <gist-url>${colors.reset} [-o <output>] [--dry-run] [--debug]`);
            console.log(`  ${colors.yellow}tree2dir generate${colors.reset} (interactive mode)`);
            
            process.exit(1);
        }
    } catch (error) {
        console.error(`${colors.red}❌ Error:${colors.reset}`, error);
        process.exit(1);
    }
}

main();
