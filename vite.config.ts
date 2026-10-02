import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    // Plugin oficial do Tailwind v4 pro Vite: substitui o par
    // postcss.config.js + tailwindcss()/autoprefixer() do PostCSS (v4 já
    // prefixa sozinho via Lightning CSS, autoprefixer virou redundante).
    plugins: [react(), tailwindcss()],
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
