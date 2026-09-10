import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '@src/theme';

import { DarkModeButton } from './index';

const renderButton = () =>
    render(
        <ThemeProvider>
            <DarkModeButton />
        </ThemeProvider>,
    );

describe('<DarkModeButton />', () => {
    it('tem nome acessível fixo e começa não-pressionado (tema claro)', () => {
        renderButton();

        const button = screen.getByRole('button', { name: 'Modo escuro' });
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('alterna aria-pressed e o tema ao clicar, mantendo o mesmo rótulo', async () => {
        const user = userEvent.setup();
        renderButton();

        const button = screen.getByRole('button', { name: 'Modo escuro' });
        await user.click(button);

        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(document.documentElement).toHaveClass('dark');
        // rótulo não muda com o estado
        expect(screen.getByRole('button', { name: 'Modo escuro' })).toBe(
            button,
        );
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = renderButton();

        expect(await axe(container)).toHaveNoViolations();
    });
});
