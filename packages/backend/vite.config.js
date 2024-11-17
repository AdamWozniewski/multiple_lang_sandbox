import { defineConfig } from 'vite';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: './js/main.js',
            output: {
                entryFileNames: 'app.bundle.js',
                assetFileNames: 'assets/[name].[hash][extname]',
            },
        },
    },
});