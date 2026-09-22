import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { DuotoneBackgroundImage } from './index';

describe('<DuotoneBackgroundImage />', () => {
    it('renderiza a foto como decorativa, com as dimensões declaradas', () => {
        const { container } = render(
            <DuotoneBackgroundImage
                src="/hero.webp"
                width={1280}
                height={720}
            />,
        );

        const image = container.querySelector('img');
        expect(image).toHaveAttribute('src', '/hero.webp');
        expect(image).toHaveAttribute('alt', '');
        expect(image).toHaveAttribute('aria-hidden', 'true');
        expect(image).toHaveAttribute('width', '1280');
        expect(image).toHaveAttribute('height', '720');
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(
            <DuotoneBackgroundImage
                src="/hero.webp"
                width={1280}
                height={720}
            />,
        );
        expect(await axe(container)).toHaveNoViolations();
    });
});
