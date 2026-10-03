import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { DimensionLine } from './index';

describe('<DimensionLine />', () => {
    it('é inteiramente decorativa (aria-hidden)', () => {
        const { container } = render(<DimensionLine />);

        expect(container.querySelector('[aria-hidden="true"]')).toBe(
            container.firstChild,
        );
    });

    it('aceita className extra pro caller controlar largura/espaçamento', () => {
        const { container } = render(<DimensionLine className="w-16 mt-3" />);

        expect(container.firstChild).toHaveClass('w-16', 'mt-3');
    });

    it('não introduz violações de acessibilidade', async () => {
        const { container } = render(<DimensionLine />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
