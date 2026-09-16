import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { ThemedBackgroundImage } from './index';

describe('<ThemedBackgroundImage />', () => {
    it('renderiza uma imagem para cada tema, decorativas', () => {
        const { container } = render(
            <ThemedBackgroundImage
                lightSrc="/light.webp"
                darkSrc="/dark.webp"
            />,
        );

        const images = container.querySelectorAll('img');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', '/light.webp');
        expect(images[0]).toHaveAttribute('alt', '');
        expect(images[1]).toHaveAttribute('src', '/dark.webp');
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(
            <ThemedBackgroundImage
                lightSrc="/light.webp"
                darkSrc="/dark.webp"
            />,
        );
        expect(await axe(container)).toHaveNoViolations();
    });
});
