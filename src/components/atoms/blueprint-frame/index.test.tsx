import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { BlueprintFrame } from './index';

describe('<BlueprintFrame />', () => {
    it('renderiza o conteúdo', () => {
        render(
            <BlueprintFrame>
                <p>conteúdo</p>
            </BlueprintFrame>,
        );

        expect(screen.getByText('conteúdo')).toBeInTheDocument();
    });

    it('as marcas de canto e a grade são decorativas (aria-hidden)', () => {
        const { container } = render(
            <BlueprintFrame grid>
                <p>x</p>
            </BlueprintFrame>,
        );

        const decoratives = container.querySelectorAll('[aria-hidden="true"]');
        // 4 cantos + 1 grade
        expect(decoratives).toHaveLength(5);
    });

    it('sem `grid`, não renderiza a camada de grade', () => {
        const { container } = render(
            <BlueprintFrame>
                <p>x</p>
            </BlueprintFrame>,
        );

        expect(container.querySelector('.blueprint-grid')).toBeNull();
    });

    it('não introduz violações de acessibilidade', async () => {
        const { container } = render(
            <BlueprintFrame grid>
                <p>conteúdo acessível</p>
            </BlueprintFrame>,
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});
