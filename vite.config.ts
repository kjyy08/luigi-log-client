import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;
                    if (id.includes('react-syntax-highlighter/dist/esm/styles')) return 'syntax-highlight-styles';
                    if (id.includes('refractor') || id.includes('prismjs')) return 'syntax-highlight-prism';
                    if (id.includes('react-syntax-highlighter')) return 'syntax-highlight-vendor';
                    if (id.includes('react-markdown') || id.includes('remark-') || id.includes('rehype-') || id.includes('micromark') || id.includes('mdast') || id.includes('hast') || id.includes('unified')) {
                        return 'markdown-vendor';
                    }
                    if (id.includes('@radix-ui')) return 'radix-vendor';
                    if (id.includes('framer-motion')) return 'motion-vendor';
                    if (id.includes('react-router')) return 'router-vendor';
                    if (id.includes('@tanstack')) return 'query-vendor';
                    if (id.includes('axios')) return 'http-vendor';
                    if (id.includes('react') || id.includes('scheduler')) return 'react-vendor';
                },
            },
        },
    },
});
