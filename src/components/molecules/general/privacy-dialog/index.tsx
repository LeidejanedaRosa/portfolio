import { useEffect, useRef } from 'react';

interface PrivacyDialogProps {
    open: boolean;
    onClose: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
}

/**
 * <dialog> nativo com showModal(): o navegador cuida do focus trap e deixa o
 * resto da página inert sozinho — reimplementar isso à mão (como a v1 deste
 * componente fazia) deixa escapar foco por Tab pro conteúdo atrás. ESC já
 * vem de graça também; só sincronizamos pelo evento "close" (dispara tanto
 * no ESC quanto no botão Fechar via dialog.close()).
 */
export function PrivacyDialog({
    open,
    onClose,
    triggerRef,
}: PrivacyDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const onNativeClose = () => {
            onClose();
            triggerRef.current?.focus();
        };
        dialog.addEventListener('close', onNativeClose);
        return () => dialog.removeEventListener('close', onNativeClose);
    }, [onClose, triggerRef]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="privacy-dialog-title"
            className="max-w-lg rounded-lg border border-border bg-surface p-6 text-left shadow-lg backdrop:bg-background/80"
        >
            <h2
                id="privacy-dialog-title"
                className="font-mono text-xl font-bold text-foreground"
            >
                Privacidade
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
                Este site só carrega o Google Tag Manager (analytics) depois que
                você aceita, na notificação de cookies. Se você recusar, nenhum
                script de rastreamento é carregado — só os arquivos necessários
                pro site funcionar (HTML, CSS, JS, fontes).
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
                Sua escolha fica salva no seu navegador (
                <code>localStorage</code>) e você pode mudar de ideia a qualquer
                momento pelo link &quot;Preferências de cookies&quot;, no fim da
                página.
            </p>
            <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="mt-6 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
            >
                Fechar
            </button>
        </dialog>
    );
}
