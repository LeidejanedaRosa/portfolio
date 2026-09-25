import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Faq } from './index';

describe('<Faq />', () => {
    it('é uma seção com título e id de âncora', () => {
        render(<Faq />);

        const heading = screen.getByRole('heading', {
            level: 2,
            name: /perguntas frequentes/i,
        });
        expect(heading).toHaveAttribute('id', 'faq-title');
    });

    it('lista as sete perguntas, todas fechadas por padrão', () => {
        render(<Faq />);

        const questions = [
            'Que tipo de projeto você topa?',
            'Trabalha remoto?',
            'Qual sua stack?',
            'Por que alguns projetos são privados?',
            'Quanto tempo dura um projeto?',
            'Você também faz o design, ou só o desenvolvimento?',
            'Como entro em contato?',
        ];

        for (const question of questions) {
            const summary = screen.getByText(question).closest('summary');
            expect(summary).toBeInTheDocument();
            expect(summary?.closest('details')).not.toHaveAttribute('open');
        }
    });

    it('clicar numa pergunta revela a resposta (details nativo)', async () => {
        const user = userEvent.setup();
        render(<Faq />);

        const question = screen.getByText('Trabalha remoto?');
        const details = question.closest('details') as HTMLDetailsElement;

        expect(details).not.toHaveAttribute('open');

        await user.click(question);

        expect(details).toHaveAttribute('open');
        expect(screen.getByText(/freelancer 100% remoto/i)).toBeVisible();
    });

    it('todo <details> compartilha o mesmo `name` — só um fica aberto por vez (accordion nativo, sem estado em React)', () => {
        render(<Faq />);

        const allDetails = document.querySelectorAll('details');
        expect(allDetails.length).toBe(7);
        allDetails.forEach((details) => {
            expect(details).toHaveAttribute('name', 'faq');
        });
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<Faq />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
