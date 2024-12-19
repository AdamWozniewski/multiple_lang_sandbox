import { resolve } from "node:path";
import { defineConfig } from "vite";
import viteImagemin from "vite-plugin-imagemin";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: resolve(__dirname, "./frontend"),
  build: {
    outDir: resolve(__dirname, "public"),
    emptyOutDir: true,
    watch: {
      include: "frontend/**/*",
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "frontend/index.html"),
        mainCss: resolve(__dirname, "frontend/css/main.css"),
        mainJs: resolve(__dirname, "frontend/js/main.js"),
      },
      output: {
        // entryFileNames: 'js/[name].js',
        entryFileNames: (chunkInfo) => {
          // Określ nazwy plików na podstawie ich roli
          if (chunkInfo.name === "main") {
            return "js/main.js";
          }
          if (chunkInfo.name === "styles") {
            return "css/main.css";
          }
          return "js/[name].js";
        },
        assetFileNames: (assetInfo) => {
          const assetRegex = /\.(png|jpe?g|gif|svg)$/;
          if (assetInfo.name.endsWith(".css")) {
            return "css/[name].css";
          }
          if (assetInfo.name.match(assetRegex)) {
            return "img/[name].[ext]";
          }
          return "[name][extname]";
        },
      },
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    name: "node",
    environment: "node",
    coverage: {
      reporter: ["lcov"],
    },
  },
  server: {
    proxy: {
      // '/api': 'http://localhost:3000',
    },
    watch: {
      usePolling: true,
      interval: 300,
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
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: "img/**/*",
          dest: "img",
        },
      ],
      watch: true,
    }),
  ],
});
