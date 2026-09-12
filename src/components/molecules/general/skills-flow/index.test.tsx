import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { SkillsFlow } from './index';

describe('<SkillsFlow />', () => {
    it('mostra as 3 colunas do fluxo', () => {
        render(<SkillsFlow />);

        expect(screen.getByText('Front-end')).toBeInTheDocument();
        expect(screen.getByText('Back-end')).toBeInTheDocument();
        expect(screen.getByText('Dados')).toBeInTheDocument();
    });

    it('tem um nó (botão) por skill, incluindo as conectadas e as que só aparecem no diagrama', () => {
        render(<SkillsFlow />);

        // 13 nós ao todo: 6 front-end + 4 back-end + 3 dados
        expect(screen.getAllByRole('button')).toHaveLength(13);
    });

    it('descreve por texto as conexões reais, pra quem não vê as linhas do SVG', () => {
        render(<SkillsFlow />);

        // "Faladoria" e "Sistema de Certificados (FCR)" só aparecem no
        // resumo (os nomes das techs também aparecem nos tooltips dos nós,
        // então não servem pra checar unicamente o resumo em si).
        expect(screen.getByText(/faladoria/i)).toBeInTheDocument();
        expect(
            screen.getByText(/sistema de certificados/i),
        ).toBeInTheDocument();
    });

    it('desenha uma linha (hairline) por conexão real', () => {
        const { container } = render(<SkillsFlow />);

        // 4 conexões reais: react→fastify, typescript→fastify,
        // fastify→mongodb, flask→mongodb. Seletor restrito ao prefixo do id
        // pra não pegar os <path> decorativos dos ícones de cada nó.
        expect(
            container.querySelectorAll('path[id^="skills-flow-edge-"]'),
        ).toHaveLength(4);
    });

    it('anima uma "luz" percorrendo cada conexão, exceto com prefers-reduced-motion', () => {
        const { container, unmount } = render(<SkillsFlow />);
        expect(container.querySelectorAll('animateMotion')).toHaveLength(4);
        unmount();

        vi.spyOn(window, 'matchMedia').mockImplementation(
            (query) =>
                ({
                    matches: query.includes('reduce'),
                    media: query,
                    onchange: null,
                    addListener: () => {},
                    removeListener: () => {},
                    addEventListener: () => {},
                    removeEventListener: () => {},
                    dispatchEvent: () => false,
                }) as MediaQueryList,
        );

        const { container: reducedContainer } = render(<SkillsFlow />);
        expect(reducedContainer.querySelectorAll('animateMotion')).toHaveLength(
            0,
        );
        // a linha em si continua visível, só a animação some
        expect(
            reducedContainer.querySelectorAll('path[id^="skills-flow-edge-"]'),
        ).toHaveLength(4);
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<SkillsFlow />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
