/** @type {import('tailwindcss').Config} */

// Cada token vira uma cor Tailwind que lê a variável CSS definida em index.css.
// `<alpha-value>` é o placeholder que o Tailwind troca pela opacidade da classe
// (ex.: `bg-accent/50`).
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                background: token('background'),
                foreground: token('foreground'),
                surface: {
                    DEFAULT: token('surface'),
                    foreground: token('surface-foreground'),
                },
                muted: {
                    DEFAULT: token('muted'),
                    foreground: token('muted-foreground'),
                },
                border: token('border'),
                primary: {
                    DEFAULT: token('primary'),
                    foreground: token('primary-foreground'),
                },
                accent: {
                    DEFAULT: token('accent'),
                    foreground: token('accent-foreground'),
                },
                danger: {
                    DEFAULT: token('danger'),
                    foreground: token('danger-foreground'),
                },
            },
            fontFamily: {
                // Corpo: IBM Plex Sans (legibilidade de UI)
                sans: [
                    '"IBM Plex Sans Variable"',
                    'ui-sans-serif',
                    'system-ui',
                    'sans-serif',
                ],
                // Títulos: JetBrains Mono (assinatura de quem programa)
                mono: [
                    '"JetBrains Mono Variable"',
                    'ui-monospace',
                    'SFMono-Regular',
                    'monospace',
                ],
            },
        },
    },
    plugins: [],
};
