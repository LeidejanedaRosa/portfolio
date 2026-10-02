import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

// Tailwind v4 não tem mais config em JS pra inspecionar via `resolveConfig`
// (API removida na v4) — o contrato agora mora direto no CSS (`@theme` em
// index.css), então o teste lê o arquivo fonte como texto.
const css = readFileSync(resolve(__dirname, '../index.css'), 'utf-8');

/**
 * Contrato do design system: as cores são SEMÂNTICAS (papéis) e apontam para
 * variáveis CSS — nunca valores crus de paleta. Se alguém apagar um token do
 * `@theme` ou trocar a estratégia de dark mode, este teste quebra.
 */
describe('design system — tokens do Tailwind (@theme)', () => {
    it('expõe as cores semânticas como variáveis CSS completas (não placeholder <alpha-value> da v3)', () => {
        expect(css).toMatch(/--color-background:\s*rgb\(/);
        expect(css).toMatch(/--color-accent:\s*rgb\(/);
        expect(css).toMatch(/--color-accent-foreground:\s*rgb\(/);
        expect(css).not.toContain('<alpha-value>');
    });

    it('define primary como papel (variável), não como cor crua', () => {
        expect(css).toMatch(/--color-primary:\s*rgb\(/);
    });

    it('usa JetBrains Mono nos títulos e IBM Plex Sans no corpo', () => {
        expect(css).toMatch(/--font-mono:\s*\n?\s*'JetBrains Mono Variable'/);
        expect(css).toMatch(/--font-sans:\s*\n?\s*'IBM Plex Sans Variable'/);
    });

    it('mantém suporte a dark mode por classe (não só prefers-color-scheme)', () => {
        expect(css).toContain(
            '@custom-variant dark (&:where(.dark, .dark *));',
        );
    });

    it('redefine os tokens de cor dentro de `.dark`, não cria um conjunto novo', () => {
        const darkBlock = css.slice(css.indexOf('.dark {'));
        expect(darkBlock).toMatch(/--color-background:\s*rgb\(/);
        expect(darkBlock).toMatch(/--color-accent:\s*rgb\(/);
    });
});
