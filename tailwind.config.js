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
            // TODO(backlog 4.4): mover para a branch feat/navbar-scroll junto com o HamburgerMenu
            animation: {
                'item-1': 'fadeIn 0.3s ease-out 0s forwards',
                'item-2': 'fadeIn 0.3s ease-out 0.1s forwards',
                'item-3': 'fadeIn 0.3s ease-out 0.2s forwards',
                'item-4': 'fadeIn 0.3s ease-out 0.3s forwards',
                'item-5': 'fadeIn 0.3s ease-out 0.4s forwards',
                'item-1-reverse': 'fadeOut 0.3s ease-out 0.4s forwards',
                'item-2-reverse': 'fadeOut 0.3s ease-out 0.3s forwards',
                'item-3-reverse': 'fadeOut 0.3s ease-out 0.2s forwards',
                'item-4-reverse': 'fadeOut 0.3s ease-out 0.1s forwards',
                'item-5-reverse': 'fadeOut 0.3s ease-out 0s forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'scale(0)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
                fadeOut: {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '100%': { opacity: 0, transform: 'scale(0)' },
                },
            },
        },
    },
    plugins: [require('tailwindcss-textshadow')],
};
