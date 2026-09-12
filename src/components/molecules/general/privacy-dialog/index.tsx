import { useEffect, useRef } from 'react';

interface PrivacyDialogProps {
    open: boolean;
    onClose: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Diálogo simples (não é biblioteca de terceiros — o app não usa nenhuma
 * ainda). Segue o mesmo padrão do menu mobile da Navigation: ESC fecha,
 * foco volta pro elemento que abriu.
 */
export function PrivacyDialog({
    open,
    onClose,
    triggerRef,
}: PrivacyDialogProps) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        closeButtonRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose, triggerRef]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-dialog-title"
            hidden={!open}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4"
        >
            <div className="max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg">
                <h2
                    id="privacy-dialog-title"
                    className="font-mono text-xl font-bold text-foreground"
                >
                    Privacidade
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">
                    Este site só carrega o Google Tag Manager (analytics) depois
                    que você aceita, na notificação de cookies. Se você recusar,
                    nenhum script de rastreamento é carregado — só os arquivos
                    necessários pro site funcionar (HTML, CSS, JS, fontes).
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                    Sua escolha fica salva no seu navegador (
                    <code>localStorage</code>) e você pode mudar de ideia a
                    qualquer momento pelo link &quot;Preferências de
                    cookies&quot;, no fim da página.
                </p>
                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => {
                        onClose();
                        triggerRef.current?.focus();
                    }}
                    className="mt-6 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
}
