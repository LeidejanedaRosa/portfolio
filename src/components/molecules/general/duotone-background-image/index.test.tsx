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

    it('o véu escurece mais no modo escuro — axe não pega contraste contra imagem de fundo', () => {
        // A imagem é só uma (clara, sem par clara/escura como as outras
        // seções) — sem esse reforço, o papel/lápis claro da ilustração
        // vaza por trás do texto no modo escuro (achado real da
        // Leidejane, visto num print pro LinkedIn, não pego por nenhum
        // teste automatizado: o axe-core não renderiza a imagem de fundo
        // no jsdom, então não tem como medir esse contraste).
        const { container } = render(
            <DuotoneBackgroundImage
                src="/hero.webp"
                width={1280}
                height={720}
            />,
        );

        const veil = container.querySelector('.bg-linear-to-r.from-background');
        expect(veil).toHaveClass('dark:via-background/90');
        expect(veil).toHaveClass('dark:to-background/60');
    });
});
