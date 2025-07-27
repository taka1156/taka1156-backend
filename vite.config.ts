import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { dirname, resolve } from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: 'src',
    cacheDir: resolve(__dirname + '/src/.cache'),
    server: {
        port: 9000,
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true
        },
        ssr: 'index.ts',
        outDir: '../api/',
        emptyOutDir: true
    },
    plugins: [
        ...VitePluginNode({
            exportName: 'viteNodeApp',
            adapter: 'express',
            appPath: 'index.ts',
            tsCompiler: 'esbuild',
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    }
});
