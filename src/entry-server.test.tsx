import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from './entry-server';

// `vi.stubGlobal('window', undefined)` simula o ambiente real do prerender
// (`vite build --ssr`, ver scripts/prerender.mjs): Node puro, sem `window`.
// O setup global do projeto (src/test/setup.ts, aplicado a todo teste) já
// assume um DOM disponível, então isso prova o que importa: se algum
// componente passar a ler `window`/`matchMedia` direto no corpo do render
// (fora de useEffect) sem o guard de src/theme/index.tsx, este teste quebra
// na hora — bem antes de alguém descobrir só no build de produção.
afterEach(() => {
    vi.unstubAllGlobals();
});

describe('entry-server render()', () => {
    it('gera o HTML real (não um shell vazio) sem acessar `window`', () => {
        vi.stubGlobal('window', undefined);

        const html = render();

        expect(html).toContain('Leidejane da Rosa');
        expect(html).toContain('id="home"');
        expect(html).toContain('id="projects"');
        expect(html).toContain('id="contact"');
    });
});
