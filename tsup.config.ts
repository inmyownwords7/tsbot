import { defineConfig } from 'tsup';
import alias from 'esbuild-plugin-alias';

export default defineConfig({
  entry: ['src/app.ts'],            // Entry point of your application remove "vite-project/**/*"
  format: ['esm', 'cjs'],           // Output ESM format
  dts: true,                        // Generate declaration files
  sourcemap: true,                  // Include sourcemaps for debugging
  clean: true,                      // Clean the output directory before building
  splitting: false,                 // Avoid code splitting for Node.js
  outDir: 'dist',                   // Output directory for built files
  tsconfig: 'tsconfig.json',        // Use the tsconfig.json file
  shims: true,                      // Include shims for Node.js
  target: 'es2022',                 // Supports top-level await and modern syntax

  esbuildOptions(options) {
    options.plugins = [
      alias({
        '@src': './src',
        '@utils': './src/utils',
      }),                           // Add alias plugin to the plugins array
    ];
    options.resolveExtensions = ['.ts', '.js']; // Automatically resolve extensions
  },
});
