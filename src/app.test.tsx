import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './app';

/**
 * Smoke test do pipeline real: aliases (@assets), CSS Modules, framer-motion
 * e a árvore de componentes precisam montar sem quebrar.
 */
describe('<App />', () => {
    it('renderiza o nome da dona do portfólio', () => {
        render(<App />);

        expect(
            screen.getByRole('heading', { name: /leidejane da rosa/i }),
        ).toBeInTheDocument();
    });
});
