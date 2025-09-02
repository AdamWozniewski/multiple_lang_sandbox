import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import viteImagemin from 'vite-plugin-imagemin';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const root = resolve(__dirname, 'frontend');
  const outDir = resolve(__dirname, 'public');

  return {
    root,
    base: isProd ? '/public/' : '/',
    build: {
      outDir,
      emptyOutDir: true,
      manifest: true,
      rollupOptions: {
        input: resolve(root, 'index.html'),
        output: {
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/[name].[hash][extname]';
            }
            if (
              assetInfo.name &&
              /\.(png|jpe?g|gif|svg)$/.test(assetInfo.name)
            ) {
              return 'img/[name][extname]';
            }
            return '[name].[hash][extname]';
          },
        },
      },
    },
    server: {
      middlewareMode: 'html',
      port: 5173,
      hmr: true,
      watch: { usePolling: true, interval: 300 },
    },
    css: {
      postcss: { plugins: [tailwindcss(), autoprefixer()] },
    },
    plugins: [
      isProd &&
      ViteImageOptimizer({
        png: { quality: 80 },
        jpeg: { quality: 80 },
        webp: { quality: 80 },
        avif: { quality: 60 },
      }),
      isProd &&
      viteStaticCopy({
        targets: [
          {
            src: resolve(root, 'img', '**', '*'),
            dest: 'img',
          },
        ],
        errorOnMissing: false,
      }),
      AutoImport({ imports: ['vitest'], dts: true }),
    ].filter(Boolean),
  };
});