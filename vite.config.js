import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        // Inject GA4 measurement ID into the inline <script> in index.html
        define: {
            __VITE_GA_ID__: JSON.stringify(env.VITE_GA_MEASUREMENT_ID || ''),
        },
    };
});
