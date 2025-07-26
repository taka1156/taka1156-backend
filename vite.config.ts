import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve } from 'path';

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
        nodePolyfills(),
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