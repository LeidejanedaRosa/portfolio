import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProjectPreview } from './project-preview';

const URL = 'https://exemplo.com';

describe('<ProjectPreview />', () => {
    it('sem `blocked`, mostra o iframe de verdade', () => {
        render(<ProjectPreview title="Projeto X" url={URL} hugCenter="left" />);

        const iframe = screen.getByTitle(
            'Pré-visualização ao vivo de Projeto X',
        );
        expect(iframe.tagName).toBe('IFRAME');
        expect(iframe).toHaveAttribute('src', URL);
    });

    it('com `blocked`, mostra o aviso em vez do iframe quebrado', () => {
        render(
            <ProjectPreview
                title="Projeto X"
                url={URL}
                hugCenter="left"
                blocked
            />,
        );

        expect(
            screen.queryByTitle('Pré-visualização ao vivo de Projeto X'),
        ).not.toBeInTheDocument();
        expect(
            screen.getByText(/bloqueia pré-visualização embutida/i),
        ).toBeInTheDocument();
    });

    it('nos dois casos, o link "Abrir em nova aba" aponta pra URL real', () => {
        render(
            <ProjectPreview
                title="Projeto X"
                url={URL}
                hugCenter="left"
                blocked
            />,
        );

        expect(
            screen.getByRole('link', { name: /abrir em nova aba/i }),
        ).toHaveAttribute('href', URL);
    });
});
