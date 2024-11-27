import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';
import { resolve } from 'path';
import {viteStaticCopy} from "vite-plugin-static-copy";

export default defineConfig({
    root: resolve(__dirname, './frontend'),
    build: {
        outDir: resolve(__dirname, 'public'),
        emptyOutDir: true,
        watch: { // Dodaj watch dla trybu deweloperskiego
            include: 'frontend/**/*', // Monitorowanie zmian w frontend
        },
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'frontend/index.html'), // Punkt wejścia
                mainCss: resolve(__dirname, 'frontend/css/main.css'), // Punkt wejściowy dla CSS
                mainJs: resolve(__dirname, 'frontend/js/main.js'), // Punkt wejściowy dla JS
            },
            output: {
                // entryFileNames: 'js/[name].js',
                entryFileNames: (chunkInfo) => {
                    // Określ nazwy plików na podstawie ich roli
                    if (chunkInfo.name === 'main') {
                        return 'js/main.js';
                    }
                    if (chunkInfo.name === 'styles') {
                        return 'css/main.css';
                    }
                    return 'js/[name].js';
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return 'css/[name].css';
                    }
                    if (assetInfo.name.match(/\.(png|jpe?g|gif|svg)$/)) {
                        return 'img/[name].[ext]';
                    }
                    return '[name][extname]';
                },
            },
        },
    },
    server: {
        proxy: {
            // '/api': 'http://localhost:3000',
        },
        watch: {
            usePolling: true,
            interval: 300
        },
        port: 5173,
        hmr: true,
    },
    plugins: [
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false,
            },
            optipng: {
                optimizationLevel: 7,
            },
            mozjpeg: {
                quality: 80,
            },
            pngquant: {
                quality: [0.65, 0.8],
                speed: 4,
            },
            svgo: {
                plugins: [
                    {
                        name: 'removeViewBox',
                    },
                    {
                        name: 'removeEmptyAttrs',
                        active: false,
                    },
                ],
            },
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'img/**/*',
                    dest: 'img',
                },
            ],
            watch: true
        }),
    ],
});