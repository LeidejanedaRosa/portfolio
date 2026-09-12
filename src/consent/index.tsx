import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import { loadGTM } from '@src/lib/load-gtm';

export type ConsentStatus = 'accepted' | 'rejected' | null;

const STORAGE_KEY = 'cookie-consent';
const GTM_CONTAINER_ID = 'GTM-KLCNXQQ';

interface ConsentContextValue {
    status: ConsentStatus;
    accept: () => void;
    reject: () => void;
    reset: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** `null` = ainda não decidiu (banner deve aparecer). Espelha getInitialTheme em src/theme. */
function getInitialConsent(): ConsentStatus {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'accepted' || stored === 'rejected') {
            return stored;
        }
    } catch {
        // localStorage indisponível (modo privado, etc.) — trata como "não decidiu"
    }
    return null;
}

function persist(status: ConsentStatus) {
    try {
        if (status === null) {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, status);
        }
    } catch {
        // sem persistência — a escolha ainda vale pra sessão atual
    }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<ConsentStatus>(getInitialConsent);

    // Só injeta o GTM depois do aceite explícito — nunca antes.
    useEffect(() => {
        if (status === 'accepted') {
            loadGTM(GTM_CONTAINER_ID);
        }
    }, [status]);

    const accept = useCallback(() => {
        persist('accepted');
        setStatus('accepted');
    }, []);

    const reject = useCallback(() => {
        persist('rejected');
        setStatus('rejected');
    }, []);

    // Reabre o banner (usado pelo link "Preferências de cookies"). Não
    // remove o GTM já carregado nesta sessão — recarregar a página aplica
    // a nova escolha desde o início.
    const reset = useCallback(() => {
        persist(null);
        setStatus(null);
    }, []);

    const value = useMemo(
        () => ({ status, accept, reject, reset }),
        [status, accept, reject, reset],
    );

    return (
        <ConsentContext.Provider value={value}>
            {children}
        </ConsentContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConsent(): ConsentContextValue {
    const ctx = useContext(ConsentContext);
    if (!ctx) {
        throw new Error(
            'useConsent precisa estar dentro de <ConsentProvider>.',
        );
    }
    return ctx;
}
