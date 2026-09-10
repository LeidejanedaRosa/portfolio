import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

/**
 * Sanity check da infraestrutura de testes.
 * Se este arquivo passar, temos: runner (Vitest), globals, jsdom,
 * matchers do jest-dom e do axe (a11y) todos carregados.
 */
describe('infraestrutura de testes', () => {
    it('roda o Vitest com globals habilitados', () => {
        expect(true).toBe(true);
    });

    it('tem os matchers do @testing-library/jest-dom', () => {
        const el = document.createElement('div');
        el.textContent = 'ok';
        document.body.appendChild(el);

        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent('ok');
    });

    it('tem o matcher de acessibilidade (vitest-axe)', async () => {
        document.body.innerHTML = '<button type="button">Enviar</button>';

        const results = await axe(document.body);

        expect(results).toHaveNoViolations();
    });
});
