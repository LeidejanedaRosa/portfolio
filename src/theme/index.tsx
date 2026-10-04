import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Lê a escolha salva, se houver e se o localStorage estiver disponível. */
function readStoredTheme(): Theme | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : null;
    } catch {
        // localStorage indisponível (modo privado, etc.)
        return null;
    }
}

/**
 * Decide o tema inicial: escolha salva pelo usuário tem prioridade;
 * senão segue a preferência do sistema operacional.
 * Deve espelhar o script inline em index.html (que evita o flash).
 */
function getInitialTheme(): Theme {
    return (
        readStoredTheme() ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light')
    );
}

function persist(theme: Theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // sem persistência — o tema ainda funciona na sessão atual
    }
}

// Meta "theme-color" (chrome nativo do navegador — barra de status mobile
// etc.): id fixo, ver index.html. Cores precisam bater com --color-background
// de src/index.css (@theme), light e dark.
const THEME_COLOR: Record<Theme, string> = {
    light: '#f8fafc',
    dark: '#0f172a',
};

function applyThemeColorMeta(theme: Theme) {
    document
        .getElementById('theme-color-meta')
        ?.setAttribute('content', THEME_COLOR[theme]);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    // Escolha manual (desta sessão OU persistida de uma sessão anterior):
    // decide se o listener de preferência do SO (abaixo) pode sobrescrever
    // o tema. Ref, não só checar o localStorage no momento do evento —
    // setTheme/toggleTheme marcam a escolha manual AQUI, na hora, mesmo que
    // `persist()` falhe (modo privado etc.); se checássemos só o
    // localStorage, uma escolha manual que não persistiu (por falha) seria
    // tratada como "sem escolha" e o SO sobrescreveria ela na sessão atual.
    const hasManualChoiceRef = useRef(readStoredTheme() !== null);

    // Efeito colateral único: refletir o estado na classe do <html> e na
    // meta theme-color. Tailwind (darkMode: 'class') e os tokens de
    // index.css leem a classe; o chrome nativo do navegador lê a meta.
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.style.colorScheme = theme;
        applyThemeColorMeta(theme);
    }, [theme]);

    // Só acompanha o SO enquanto o usuário não escolheu um tema manualmente
    // — getInitialTheme() já prioriza localStorage na primeira montagem,
    // mas sem isso uma mudança de tema do SO DURANTE a sessão (ex.: o
    // celular troca de claro pra escuro ao anoitecer) só aparecia depois de
    // um reload.
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (event: MediaQueryListEvent) => {
            if (!hasManualChoiceRef.current) {
                setThemeState(event.matches ? 'dark' : 'light');
            }
        };

        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    const setTheme = useCallback((next: Theme) => {
        hasManualChoiceRef.current = true;
        persist(next);
        setThemeState(next);
    }, []);

    const toggleTheme = useCallback(() => {
        hasManualChoiceRef.current = true;
        setThemeState((prev) => {
            const next: Theme = prev === 'dark' ? 'light' : 'dark';
            persist(next);
            return next;
        });
    }, []);

    const value = useMemo(
        () => ({ theme, toggleTheme, setTheme }),
        [theme, toggleTheme, setTheme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

// Provider + hook colocados de propósito (padrão de Context). O custo é só
// perder o fast-refresh deste arquivo em dev — aceitável, ele quase não muda.
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme precisa estar dentro de <ThemeProvider>.');
    }
    return ctx;
}
