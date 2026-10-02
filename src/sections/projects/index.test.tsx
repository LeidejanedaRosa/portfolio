import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Projects } from './index';

describe('<Projects />', () => {
    it('é uma seção com título e id de âncora', () => {
        render(<Projects />);

        const heading = screen.getByRole('heading', {
            level: 2,
            name: /projetos/i,
        });
        expect(heading).toHaveAttribute('id', 'projects-title');
    });

    it('lista os seis projetos com seus títulos', () => {
        render(<Projects />);

        expect(
            screen.getByRole('heading', { name: /faladoria — backend/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /faladoria — frontend/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /fcr — backend/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /fcr — verificador/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /emr international/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /espaço saúde bem-estar/i }),
        ).toBeInTheDocument();
    });

    it('projeto privado sem demo (Faladoria — Backend) não tem links de código/demo', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /faladoria — backend/i })
            .closest('li') as HTMLElement;

        expect(within(card).getByText(/privado/i)).toBeInTheDocument();
        expect(
            within(card).queryByRole('link', { name: /ver código|ver site/i }),
        ).not.toBeInTheDocument();
    });

    it('projeto privado sem demo (FCR — Backend) também não renderiza preview ao vivo', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /fcr — backend/i })
            .closest('li') as HTMLElement;

        expect(within(card).getByText(/privado/i)).toBeInTheDocument();
        expect(
            within(card).queryByRole('link', { name: /ver código|ver site/i }),
        ).not.toBeInTheDocument();
        expect(
            within(card).queryByTitle(/pré-visualização ao vivo/i),
        ).not.toBeInTheDocument();
    });

    it('projeto privado com demo pública (FCR — Verificador) mostra só "Ver site", com nota do código de teste', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /fcr — verificador/i })
            .closest('li') as HTMLElement;

        expect(within(card).getByText(/privado/i)).toBeInTheDocument();
        expect(
            within(card).queryByRole('link', { name: /ver código/i }),
        ).not.toBeInTheDocument();

        const demoLink = within(card).getByRole('link', { name: /ver site/i });
        expect(demoLink).toHaveAttribute(
            'href',
            'https://validar-certificado.fcrcursosetreinamentos.com.br/',
        );

        expect(
            within(card).getByText(/código.*testar a verificação/i),
        ).toBeInTheDocument();
    });

    it('EMR International agora é público, com links de código e demo', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /emr international/i })
            .closest('li') as HTMLElement;

        expect(within(card).getByText(/público/i)).toBeInTheDocument();

        expect(
            within(card).getByRole('link', { name: /ver código/i }),
        ).toHaveAttribute(
            'href',
            'https://github.com/LeidejanedaRosa/landing-page-emr-international-frontend',
        );
        expect(
            within(card).getByRole('link', { name: /ver site/i }),
        ).toHaveAttribute(
            'href',
            'https://landing-page-emr-international.vercel.app/',
        );
    });

    it('projeto público tem links de código e demo em nova aba', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /espaço saúde bem-estar/i })
            .closest('li') as HTMLElement;

        expect(within(card).getByText(/público/i)).toBeInTheDocument();

        const codeLink = within(card).getByRole('link', {
            name: /ver código/i,
        });
        expect(codeLink).toHaveAttribute(
            'href',
            'https://github.com/LeidejanedaRosa/landing-espaco-saude-bemestar',
        );
        expect(codeLink).toHaveAttribute('target', '_blank');
        expect(codeLink).toHaveAttribute(
            'rel',
            expect.stringContaining('noreferrer'),
        );

        const demoLink = within(card).getByRole('link', { name: /ver site/i });
        expect(demoLink).toHaveAttribute(
            'href',
            'https://landing-espaco-saude-bemestar.vercel.app',
        );
    });

    it('projetos privados trazem um trecho de código real, sem segredo, atrás de um <details>', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /faladoria — backend/i })
            .closest('li') as HTMLElement;

        const disclosure = within(card)
            .getByText(/ver trecho de código/i)
            .closest('details') as HTMLDetailsElement;
        expect(disclosure).toBeInTheDocument();
        expect(disclosure).not.toHaveAttribute('open');
        expect(
            within(disclosure).getByText('requireRole.ts'),
        ).toBeInTheDocument();

        // nenhum segredo (token/chave/senha) vaza no trecho
        expect(disclosure.textContent).not.toMatch(
            /api[_-]?key|secret|password|token\s*[:=]/i,
        );
    });

    // Timeout maior que o padrão (5s): sob disputa de CPU (ex.: suíte
    // inteira rodando no hook de pre-push) o axe-core pode passar de 5s.
    it('tem fundo de blueprint nos dois temas, escondido de leitor de tela', () => {
        const { container } = render(<Projects />);

        const backgrounds = Array.from(
            container.querySelectorAll('img'),
        ).filter((img) =>
            img.getAttribute('src')?.includes('projects-blueprint-bg'),
        );

        expect(backgrounds).toHaveLength(2);
        for (const img of backgrounds) {
            expect(img).toHaveAttribute('alt', '');
            expect(img).toHaveAttribute('aria-hidden', 'true');
        }
        expect(
            screen
                .queryAllByRole('img')
                .filter((img) => backgrounds.includes(img as HTMLImageElement)),
        ).toHaveLength(0);
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<Projects />);

        // iframes: false — o axe tenta entrar no frame pra auditar o
        // conteúdo dele, mas em jsdom não existe navegação real (o `src`
        // nunca carrega de verdade), e isso derruba o teste com
        // "Respondable target must be a frame in the current window". O que
        // continua sendo checado aqui é o próprio elemento (title presente
        // etc.); o site de dentro do iframe é auditado no Lighthouse dele.
        expect(await axe(container, { iframes: false })).toHaveNoViolations();
    }, 15000);

    // jsdom não faz layout de verdade — offsetHeight/offsetTop são sempre 0,
    // então `measure()` (dentro do useLayoutEffect) nunca passa do primeiro
    // `if (!ulHeight) return`. Sobrescrever os dois no prototype antes de
    // renderizar simula um navegador real o bastante pra exercitar o resto
    // da função (o cálculo de `top`/`bottom` de cada card).
    it('mede a posição real dos cards quando a lista tem altura', () => {
        const originalOffsetHeight = Object.getOwnPropertyDescriptor(
            HTMLElement.prototype,
            'offsetHeight',
        );
        const originalOffsetTop = Object.getOwnPropertyDescriptor(
            HTMLElement.prototype,
            'offsetTop',
        );

        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
            configurable: true,
            value: 600,
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
            configurable: true,
            value: 100,
        });

        try {
            expect(() => render(<Projects />)).not.toThrow();
            // mede de verdade, não só "não quebrou": os 6 projetos continuam
            // todos renderizados depois do measure() rodar com valores
            // reais (getAllByRole('listitem') pegaria também as listas de
            // tech stack dentro de cada card, por isso os headings).
            expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(
                6,
            );
        } finally {
            if (originalOffsetHeight) {
                Object.defineProperty(
                    HTMLElement.prototype,
                    'offsetHeight',
                    originalOffsetHeight,
                );
            }
            if (originalOffsetTop) {
                Object.defineProperty(
                    HTMLElement.prototype,
                    'offsetTop',
                    originalOffsetTop,
                );
            }
        }
    });

    // Navegador sem ResizeObserver (raro hoje): o componente mede uma vez no
    // mount e segue sem observar, em vez de quebrar o app inteiro. O stub
    // global em src/test/setup.ts sempre fornece um ResizeObserver, então
    // esse branch precisa desligá-lo manualmente pra ser exercitado.
    it('sem ResizeObserver no navegador, mede uma vez no mount e não quebra', () => {
        const originalWindowRO = window.ResizeObserver;
        const originalGlobalRO = globalThis.ResizeObserver;

        // @ts-expect-error — simulando navegador sem suporte a ResizeObserver
        window.ResizeObserver = undefined;
        // @ts-expect-error — idem
        globalThis.ResizeObserver = undefined;

        try {
            expect(() => render(<Projects />)).not.toThrow();
            expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(
                6,
            );
        } finally {
            window.ResizeObserver = originalWindowRO;
            globalThis.ResizeObserver = originalGlobalRO;
        }
    });
});
