#!/usr/bin/env node

import { program } from 'commander';
import { generate } from './commands/generate';
import * as readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fetchGistContent } from './utils/gistParser';

program
    .name("🌲 tree2dir")
    .description("🚀 Effortlessly transform ASCII trees into real-world directory structures. Perfect for rapid prototyping, educational purposes, or just plain fun!")
    .version("1.0.0", '-v, --version', 'Display the current version of tree2dir')

program
    .command('generate')
    .description('Generate directory structure from an ASCII tree')
    .option('-f, --file <path>', 'Path to the ASCII tree file')
    .option('-g, --gist <gistUrl>', 'URL of the GitHub gist containing the ASCII tree')
    .action(async (options) => {
        if (options.file) {
            const filePath = path.resolve(process.cwd(), options.file);
            try {
                const asciiTree = fs.readFileSync(filePath, 'utf8');
                await generate(asciiTree);
            } catch (error) {
                console.error('Error reading file:', error);
            }
        } else if (options.gist) {
            const gistId = options.gist.split('/').pop() || '';
            try {
                const asciiTree = await fetchGistContent(gistId);
                await generate(asciiTree);
            } catch (error) {
                console.error('Error fetching gist:', error);
            }
        } else {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            console.log('Paste your ASCII tree here (press Ctrl+D when finished):');

            let asciiTree = '';
            rl.on('line', (input) => {
                asciiTree += input + '\n';
            });

            // Handle SIGINT for graceful shutdown
            rl.on('SIGINT', () => {
                console.log('Process interrupted by user.');
                rl.close();
                process.exit(0);
            });

            rl.on('close', async () => {
                try {
                    await generate(asciiTree);
                } catch (error) {
                    console.error('Error generating structure:', error);
                }
            });
        }
    });

program.parse(process.argv);
