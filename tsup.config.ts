import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        cli: 'src/index.ts', // Entry point for the CLI
        lib: 'src/commands/generate.ts' // Entry point for the library
    },
    format: ['cjs', 'esm', 'iife'], // Output formats: CommonJS, ES Module, and IIFE for browsers
    splitting: false, // Disable code splitting
    sourcemap: true, // Include source maps
    clean: true, // Clean the dist folder before building
    dts: true, // Generate declaration files
});