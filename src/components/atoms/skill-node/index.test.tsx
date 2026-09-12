import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { siReact } from 'simple-icons';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { SkillNode } from './index';

describe('<SkillNode />', () => {
    it('o botão tem o nome da skill como nome acessível, via o próprio tooltip', () => {
        render(<SkillNode icon={siReact} />);

        // nome acessível vem do aria-labelledby apontando pro tooltip — não
        // do conteúdo do botão (o svg é decorativo, aria-hidden)
        const button = screen.getByRole('button', { name: 'React' });
        const labelledBy = button.getAttribute('aria-labelledby');
        const tooltip = document.getElementById(labelledBy!);
        expect(tooltip).toHaveAttribute('role', 'tooltip');
    });

    it('aceita um label customizado em vez do título do ícone', () => {
        render(<SkillNode icon={siReact} label="React 19" />);

        expect(screen.getByText('React 19')).toBeInTheDocument();
    });

    it('o ícone é decorativo (svg aria-hidden, nome só no tooltip)', () => {
        render(<SkillNode icon={siReact} />);

        const svg = document.querySelector('svg');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('o tooltip fica visível ao focar o botão via teclado', async () => {
        const user = userEvent.setup();
        render(<SkillNode icon={siReact} />);

        const button = screen.getByRole('button');
        await user.tab();

        expect(button).toHaveFocus();

        // jsdom não computa CSS de verdade (o stylesheet do Tailwind não é
        // carregado nos testes), então não dá pra checar `opacity` calculada.
        // O jeito de travar a regressão é garantir que a classe que faz o
        // tooltip aparecer no foco (`group-focus-within:opacity-100`)
        // continua no elemento certo — mesmo padrão já usado neste projeto
        // pra `sticky` em layout/index.test.tsx.
        const labelledBy = button.getAttribute('aria-labelledby');
        const tooltip = document.getElementById(labelledBy!);
        expect(tooltip).toHaveClass('group-focus-within:opacity-100');
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<SkillNode icon={siReact} />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
