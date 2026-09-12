import { useRef, useState } from 'react';

import { PrivacyDialog } from '@components/molecules/general/privacy-dialog';
import { useConsent } from '@src/consent';

/**
 * Notificação de cookies (LGPD): só aparece enquanto `status` for `null`
 * (usuário ainda não decidiu). Some assim que aceitar/recusar — ver
 * src/consent pro efeito que carrega o GTM (só depois do aceite).
 */
export function CookieConsentBanner() {
    const { status, accept, reject } = useConsent();
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const learnMoreRef = useRef<HTMLButtonElement>(null);

    if (status !== null) return null;

    return (
        <>
            <div
                role="region"
                aria-label="Aviso de cookies"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface p-4 shadow-lg sm:p-6"
            >
                <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Usamos cookies só para analytics (Google Tag Manager), e
                        apenas se você aceitar.{' '}
                        <button
                            ref={learnMoreRef}
                            type="button"
                            onClick={() => setPrivacyOpen(true)}
                            className="font-medium text-accent underline underline-offset-2 hover:opacity-80"
                        >
                            Saiba mais
                        </button>
                        .
                    </p>
                    <div className="flex shrink-0 gap-3">
                        <button
                            type="button"
                            onClick={reject}
                            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            Recusar
                        </button>
                        <button
                            type="button"
                            onClick={accept}
                            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
                        >
                            Aceitar
                        </button>
                    </div>
                </div>
            </div>

            <PrivacyDialog
                open={privacyOpen}
                onClose={() => setPrivacyOpen(false)}
                triggerRef={learnMoreRef}
            />
        </>
    );
}
