import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve } from 'path';

export default defineConfig({
    root: 'app',
    cacheDir: resolve(__dirname + '/app/.cache'),
    server: {
        port: 9000,
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true
        },
        ssr: 'index.ts',
        outDir: '../../dist/',
        emptyOutDir: true
    },
    plugins: [
        nodePolyfills(),
        ...VitePluginNode({
            exportName: 'viteNodeApp',
            adapter: 'express',
            appPath: 'api/index.ts',
            tsCompiler: 'esbuild',
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'api'),
        },
    },
});