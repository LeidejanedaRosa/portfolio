import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()],
        },
    },
    resolve: {
        // Devem espelhar `paths` em tsconfig.app.json
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@sections': path.resolve(__dirname, 'src/sections'),
        },
    },
    server: {
        port: 3000,
    },
});
