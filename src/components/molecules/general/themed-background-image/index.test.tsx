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

    // Achado da auditoria de 2026-10: o teste acima confere `src`/`alt` nas
    // duas imagens, mas nunca qual delas é a escondida/mostrada por tema —
    // se as classes `dark:hidden`/`dark:block` fossem trocadas de lugar
    // entre as imagens (mostrando a do tema errado), nada acusaria. jsdom
    // não computa CSS de verdade (sem stylesheet do Tailwind carregado nos
    // testes), então o jeito de travar isso é garantir que a classe certa
    // está no elemento certo — mesmo padrão já usado em `skill-node` e
    // `tech-carousel`.
    it('a imagem clara some no escuro (dark:hidden) e a escura só aparece no escuro (dark:block) — não o contrário', () => {
        const { container } = render(
            <ThemedBackgroundImage
                lightSrc="/light.webp"
                darkSrc="/dark.webp"
            />,
        );

        const images = container.querySelectorAll('img');
        const lightImg = images[0];
        const darkImg = images[1];

        expect(lightImg).toHaveAttribute('src', '/light.webp');
        expect(lightImg).toHaveClass('dark:hidden');
        expect(lightImg).not.toHaveClass('dark:block');

        expect(darkImg).toHaveAttribute('src', '/dark.webp');
        expect(darkImg).toHaveClass('hidden', 'dark:block');
        expect(darkImg).not.toHaveClass('dark:hidden');
    });

    it('o véu (scrim) de cada tema segue a mesma regra: claro some no escuro, escuro só aparece no escuro', () => {
        const { container } = render(
            <ThemedBackgroundImage
                lightSrc="/light.webp"
                darkSrc="/dark.webp"
            />,
        );

        const scrims = Array.from(
            container.querySelectorAll('div[aria-hidden="true"]'),
        );
        expect(scrims).toHaveLength(2);

        const [lightScrim, darkScrim] = scrims;
        expect(lightScrim).toHaveClass('dark:hidden');
        expect(lightScrim).not.toHaveClass('dark:block');
        expect(darkScrim).toHaveClass('hidden', 'dark:block');
        expect(darkScrim).not.toHaveClass('dark:hidden');
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
