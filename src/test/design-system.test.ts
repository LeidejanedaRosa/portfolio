import resolveConfig from 'tailwindcss/resolveConfig';
import { describe, expect, it } from 'vitest';

// @ts-expect-error — config em JS (CommonJS), sem tipos próprios
import tailwindConfig from '../../tailwind.config.js';

const { theme } = resolveConfig(tailwindConfig);

/**
 * Contrato do design system: as cores são SEMÂNTICAS (papéis) e apontam para
 * variáveis CSS — nunca valores crus de paleta. Se alguém trocar `bg-accent`
 * por `bg-sky-700` no config, este teste quebra.
 */
describe('design system — tokens do Tailwind', () => {
    it('expõe as cores semânticas ligadas às variáveis CSS', () => {
        expect(theme.colors.background).toBe(
            'rgb(var(--color-background) / <alpha-value>)',
        );
        expect(theme.colors.accent.DEFAULT).toBe(
            'rgb(var(--color-accent) / <alpha-value>)',
        );
        expect(theme.colors.accent.foreground).toBe(
            'rgb(var(--color-accent-foreground) / <alpha-value>)',
        );
    });

    it('define primary como papel (variável), não como cor crua', () => {
        expect(theme.colors.primary.DEFAULT).toContain('var(--color-primary)');
    });

    it('usa JetBrains Mono nos títulos e IBM Plex Sans no corpo', () => {
        expect(theme.fontFamily.mono[0]).toBe('"JetBrains Mono Variable"');
        expect(theme.fontFamily.sans[0]).toBe('"IBM Plex Sans Variable"');
    });

    it('mantém suporte a dark mode por classe', () => {
        expect(tailwindConfig.darkMode).toBe('class');
    });
});
