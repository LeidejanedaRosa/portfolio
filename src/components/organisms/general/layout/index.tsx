import { useEffect, useRef, type ReactNode } from 'react';

import { Navigation } from '../navigation';

interface LayoutProps {
    children: ReactNode;
}

/**
 * Casca da aplicação: landmarks semânticos (<header>, <main>) + skip link.
 *
 * `position: sticky` fica no <header>, não no <nav> dentro dele (era assim
 * antes — bug real, achado por ela): um elemento sticky só "gruda" enquanto
 * a caixa do PAI dele (o "containing block") ainda está na tela. Se o
 * <header> só contém o <nav> e é o <nav> que tem `sticky`, a caixa do
 * <header> acaba do MESMO tamanho do <nav> — ou seja, mal a página rola
 * alguns pixels, o <header> (o "containing block" do nav) já saiu da tela, e
 * o nav sticky "bate na borda" dele e para de grudar, sumindo do topo. Com o
 * sticky no <header> em vez do <nav>, o pai do header passa a ser a página
 * inteira (bem mais alta que ele) — sobra espaço de verdade pra grudar.
 */
export function Layout({ children }: LayoutProps) {
    const headerRef = useRef<HTMLElement>(null);

    // Publica a altura real da barra fixa (o <header>) como variável CSS
    // (--nav-height). A Home usa isso pra fazer a hero ocupar "tela menos
    // barra" sem cravar um número mágico que quebraria se a barra mudasse de
    // altura (ex.: menu mobile aberto, zoom do navegador).
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const updateHeight = () => {
            document.documentElement.style.setProperty(
                '--nav-height',
                `${header.getBoundingClientRect().height}px`,
            );
        };

        updateHeight();

        if (typeof ResizeObserver === 'undefined') {
            // Navegador sem suporte (raro hoje): mede uma vez no mount e
            // segue sem observar — melhor que quebrar o app inteiro.
            return;
        }

        const observer = new ResizeObserver(updateHeight);
        observer.observe(header);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Primeiro elemento focável: pula a navegação e vai pro conteúdo */}
            <a
                href="#main"
                className="sr-only rounded bg-accent px-4 py-2 text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
            >
                Pular para o conteúdo
            </a>

            {/* bg-background sólido, sem transparência nem backdrop-blur: a
                barra é sticky bem em cima do limite entre seções (ex.:
                Home → Sobre), então o "vidro fosco" deixava a última fatia
                da seção anterior transparecer através dela — lia como bug,
                não como efeito. */}
            <header
                ref={headerRef}
                className="sticky top-0 z-50 border-b border-border bg-background"
            >
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
