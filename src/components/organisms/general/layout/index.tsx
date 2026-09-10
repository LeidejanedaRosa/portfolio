import { type ReactNode } from 'react';

import { Navigation } from '../navigation';

interface LayoutProps {
    children: ReactNode;
}

/**
 * Casca da aplicação: landmarks semânticos (<header>, <main>) + skip link.
 */
export function Layout({ children }: LayoutProps) {
    return (
        <>
            {/* Primeiro elemento focável: pula a navegação e vai pro conteúdo */}
            <a
                href="#main"
                className="sr-only rounded bg-accent px-4 py-2 text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
            >
                Pular para o conteúdo
            </a>

            <header>
                <Navigation />
            </header>

            {/* tabIndex=-1: alvo focável do skip link. O foco visível vem da
                regra global :focus-visible (ring-accent) em index.css. */}
            <main id="main" tabIndex={-1}>
                {children}
            </main>
        </>
    );
}
