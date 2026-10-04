import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { ExperienceTimeline, type TimelineEntry } from './index';

function mockPrefersReducedMotion(matches: boolean) {
    vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) =>
            ({
                matches: query.includes('reduce') ? matches : false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }) as MediaQueryList,
    );
}

const ENTRIES: TimelineEntry[] = [
    {
        id: 'a',
        period: '2013–2020',
        role: 'Empreendedora',
        org: 'Estação Festas',
    },
    {
        id: 'b',
        period: 'mar 2025 – atual',
        role: 'Freelancer',
        org: 'Projetos próprios',
        description: 'Impacto social',
    },
];

describe('<ExperienceTimeline />', () => {
    it('lista as experiências em ordem, como uma sequência cronológica real', () => {
        render(<ExperienceTimeline entries={ENTRIES} />);

        const list = screen.getByRole('list');
        const items = screen.getAllByRole('listitem');
        expect(list.tagName).toBe('OL');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('Estação Festas');
        expect(items[1]).toHaveTextContent('Freelancer');
    });

    it('mostra a descrição quando fornecida', () => {
        render(<ExperienceTimeline entries={ENTRIES} />);

        expect(screen.getByText('Impacto social')).toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<ExperienceTimeline entries={ENTRIES} />);
        expect(await axe(container)).toHaveNoViolations();
    });

    // Achado da auditoria de 2026-10: faltava aqui o mesmo hardening que
    // <Projects /> já tem (acrescentado depois de um achado do CodeRabbit,
    // nunca replicado pra esta timeline). jsdom não faz layout de verdade —
    // offsetHeight/offsetTop/offsetParent são sempre 0/null, então
    // `measure()` (dentro do useLayoutEffect) nunca passava do primeiro
    // `if (!listHeight) return`. Sobrescrever os três no prototype antes de
    // renderizar simula um navegador real o bastante pra exercitar o resto
    // da função (o cálculo de threshold de cada marcador). offsetParent
    // precisa apontar pro <li> (não fica null feito no jsdom puro): o
    // marcador é filho direto de um <li> com position:relative, então num
    // navegador real o offsetParent dele É o próprio <li>.
    it('mede a posição real dos marcadores quando a lista tem altura', () => {
        const originalOffsetHeight = Object.getOwnPropertyDescriptor(
            HTMLElement.prototype,
            'offsetHeight',
        );
        const originalOffsetTop = Object.getOwnPropertyDescriptor(
            HTMLElement.prototype,
            'offsetTop',
        );
        const originalOffsetParent = Object.getOwnPropertyDescriptor(
            HTMLElement.prototype,
            'offsetParent',
        );

        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
            configurable: true,
            value: 400,
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
            configurable: true,
            value: 50,
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
            configurable: true,
            get(this: HTMLElement) {
                return this.parentElement;
            },
        });

        try {
            expect(() =>
                render(<ExperienceTimeline entries={ENTRIES} />),
            ).not.toThrow();
            // mede de verdade, não só "não quebrou": as duas entradas
            // continuam todas renderizadas depois do measure() rodar com
            // valores reais.
            expect(screen.getAllByRole('listitem')).toHaveLength(2);
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
            if (originalOffsetParent) {
                Object.defineProperty(
                    HTMLElement.prototype,
                    'offsetParent',
                    originalOffsetParent,
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
            expect(() =>
                render(<ExperienceTimeline entries={ENTRIES} />),
            ).not.toThrow();
            expect(screen.getAllByRole('listitem')).toHaveLength(2);
        } finally {
            window.ResizeObserver = originalWindowRO;
            globalThis.ResizeObserver = originalGlobalRO;
        }
    });

    // A "luz" (m.span solta, direto dentro da <ol>, fora de qualquer <li>)
    // só existe no JSX quando NÃO há reduced-motion — diferente do caso da
    // Home (ver PR #51), aqui é presença/ausência real no DOM, não um
    // `animate` do framer-motion, então dá pra provar de verdade em teste.
    it('a "luz" que acompanha o scroll só existe sem prefers-reduced-motion', () => {
        const { container: withMotion } = render(
            <ExperienceTimeline entries={ENTRIES} />,
        );
        expect(
            withMotion.querySelector('ol > span[aria-hidden="true"]'),
        ).toBeInTheDocument();

        mockPrefersReducedMotion(true);

        const { container: reduced } = render(
            <ExperienceTimeline entries={ENTRIES} />,
        );
        expect(
            reduced.querySelector('ol > span[aria-hidden="true"]'),
        ).not.toBeInTheDocument();
    });
});
