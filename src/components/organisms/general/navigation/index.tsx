import { useCallback, useEffect, useRef, useState, type Ref } from 'react';
import {
    Bars3Icon,
    BriefcaseIcon,
    EnvelopeIcon,
    HomeIcon,
    QuestionMarkCircleIcon,
    UserIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

import { DarkModeButton } from '@components/molecules/general/dark-mode';

import { useActiveSection } from './use-active-section';

interface NavItem {
    id: string;
    label: string;
    Icon: typeof HomeIcon;
}

// Referência estável (fora do componente) — o hook depende disso.
const ITEMS: readonly NavItem[] = [
    { id: 'home', label: 'Início', Icon: HomeIcon },
    { id: 'about', label: 'Sobre', Icon: UserIcon },
    { id: 'projects', label: 'Projetos', Icon: BriefcaseIcon },
    { id: 'faq', label: 'FAQ', Icon: QuestionMarkCircleIcon },
    { id: 'contact', label: 'Contato', Icon: EnvelopeIcon },
];
const ITEM_IDS = ITEMS.map((item) => item.id);

function NavLink({
    item,
    active,
    onNavigate,
}: {
    item: NavItem;
    active: boolean;
    onNavigate?: () => void;
}) {
    return (
        <a
            href={`#${item.id}`}
            aria-current={active ? 'true' : undefined}
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground'
            }`}
        >
            <item.Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
        </a>
    );
}

export const Navigation = ({
    barRef,
}: {
    /** Ref da barra fixa (sem o painel mobile) — quem publica
     * `--nav-height` (`<Layout />`) precisa medir só ela, não o `<nav>`
     * inteiro: com o painel do menu mobile somado, abrir o menu "infla" a
     * altura publicada, e um link clicado lá dentro rola a página usando
     * essa altura inflada — sobra um vão acima da seção de destino, porque
     * o painel já fechou quando o salto termina. */
    barRef?: Ref<HTMLDivElement>;
}) => {
    const active = useActiveSection(ITEM_IDS);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    // Fecha o menu e devolve o foco ao botão (WAI-ARIA APG): sem isso, o foco
    // ficaria "preso" num link do painel que acabou de virar hidden → cai no body.
    const closeMenu = useCallback(() => {
        menuButtonRef.current?.focus();
        setMenuOpen(false);
    }, []);

    // ESC fecha o menu mobile
    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeMenu();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen, closeMenu]);

    return (
        <nav aria-label="Principal">
            <div
                ref={barRef}
                className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3"
            >
                <a
                    href="#home"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-sm font-bold text-foreground"
                >
                    Leidejane da Rosa
                </a>

                <ul className="hidden items-center gap-1 md:flex">
                    {ITEMS.map((item) => (
                        <li key={item.id}>
                            <NavLink item={item} active={active === item.id} />
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2">
                    <DarkModeButton />
                    <button
                        ref={menuButtonRef}
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-muted md:hidden"
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? (
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            <ul
                id="mobile-nav"
                hidden={!menuOpen}
                className="border-t border-border px-6 py-2 md:hidden"
            >
                {ITEMS.map((item) => (
                    <li key={item.id}>
                        <NavLink
                            item={item}
                            active={active === item.id}
                            onNavigate={closeMenu}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};
