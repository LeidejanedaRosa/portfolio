import { render, screen } from '@testing-library/react';
import { siReact, type SimpleIcon } from 'simple-icons';
import { describe, expect, it } from 'vitest';

import { TechIcon } from './index';

/** Fixtures controlados — não dependem do `hex` que o simple-icons publica. */
const makeIcon = (hex: string, title = 'Marca'): SimpleIcon =>
    ({ title, hex, path: 'M0 0h24v24H0z' }) as unknown as SimpleIcon;

const nearBlackIcon = makeIcon('0A0A0A', 'Marca escura');
const vividIcon = makeIcon('61DAFB', 'Marca vívida');

describe('<TechIcon />', () => {
    it('mostra o nome da tecnologia e esconde o svg do leitor de tela', () => {
        const { container } = render(
            <ul>
                <TechIcon icon={siReact} />
            </ul>,
        );

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(container.querySelector('svg')).toHaveAttribute(
            'aria-hidden',
            'true',
        );
    });

    it('aceita um rótulo customizado', () => {
        render(
            <ul>
                <TechIcon icon={siReact} label="React 19" />
            </ul>,
        );

        expect(screen.getByText('React 19')).toBeInTheDocument();
    });

    it('usa o accent como cor de hover para marcas quase pretas', () => {
        const { container } = render(
            <ul>
                <TechIcon icon={nearBlackIcon} />
            </ul>,
        );

        // hex 0A0A0A é quase preto → some no dark, então cai no accent
        expect(container.querySelector('svg')).toHaveStyle({
            '--tech-hover': 'rgb(var(--color-accent))',
        });
    });

    it('usa a cor da marca no hover quando ela é bem visível', () => {
        const { container } = render(
            <ul>
                <TechIcon icon={vividIcon} />
            </ul>,
        );

        expect(container.querySelector('svg')).toHaveStyle({
            '--tech-hover': '#61DAFB',
        });
    });
});
