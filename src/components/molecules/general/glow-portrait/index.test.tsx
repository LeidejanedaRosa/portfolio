import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { GlowPortrait } from './index';

describe('<GlowPortrait />', () => {
    it('mostra a imagem com o alt informado', () => {
        render(<GlowPortrait src="/photo.webp" alt="Retrato de alguém" />);

        const img = screen.getByRole('img', { name: 'Retrato de alguém' });
        expect(img).toHaveAttribute('src', '/photo.webp');
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(
            <GlowPortrait src="/photo.webp" alt="Retrato de alguém" />,
        );
        expect(await axe(container)).toHaveNoViolations();
    });
});
