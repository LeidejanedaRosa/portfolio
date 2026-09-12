import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { PrivacyDialog } from './index';

function setup(open = true) {
    const triggerRef = createRef<HTMLButtonElement>();
    const onClose = vi.fn();
    const { container } = render(
        <>
            <button ref={triggerRef} type="button">
                abrir
            </button>
            <PrivacyDialog
                open={open}
                onClose={onClose}
                triggerRef={triggerRef}
            />
        </>,
    );
    return { onClose, triggerRef, container };
}

describe('<PrivacyDialog />', () => {
    it('fica oculto quando open=false', () => {
        setup(false);

        expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();
    });

    it('ESC fecha e devolve o foco pro trigger', async () => {
        const user = userEvent.setup();
        const { onClose, triggerRef } = setup(true);

        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(triggerRef.current).toHaveFocus();
    });

    it('botão Fechar chama onClose e devolve o foco', async () => {
        const user = userEvent.setup();
        const { onClose, triggerRef } = setup(true);

        await user.click(screen.getByRole('button', { name: 'Fechar' }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(triggerRef.current).toHaveFocus();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = setup(true);

        expect(await axe(container)).toHaveNoViolations();
    });
});
