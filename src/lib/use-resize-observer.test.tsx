import { render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useResizeObserver } from './use-resize-observer';

type ROCallback = () => void;

let capturedCallback: ROCallback | undefined;
const observe = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
    // function normal, não arrow: `new ResizeObserver(...)` precisa de um
    // construtor de verdade (mesmo motivo documentado em
    // use-active-section.test.ts pro IntersectionObserver).
    vi.stubGlobal(
        'ResizeObserver',
        vi.fn(function (cb: ROCallback) {
            capturedCallback = cb;
            return { observe, unobserve: vi.fn(), disconnect };
        }),
    );
});

afterEach(() => {
    vi.unstubAllGlobals();
    capturedCallback = undefined;
    observe.mockClear();
    disconnect.mockClear();
});

function TestComponent({
    onMeasure,
}: {
    onMeasure: (el: HTMLDivElement) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useResizeObserver(ref, onMeasure);
    return <div ref={ref} data-testid="target" />;
}

describe('useResizeObserver', () => {
    it('mede o elemento uma vez no mount e observa ele', () => {
        const onMeasure = vi.fn();
        const { getByTestId } = render(<TestComponent onMeasure={onMeasure} />);

        expect(onMeasure).toHaveBeenCalledTimes(1);
        expect(onMeasure).toHaveBeenCalledWith(getByTestId('target'));
        expect(observe).toHaveBeenCalledWith(getByTestId('target'));
    });

    it('remede quando o ResizeObserver dispara', () => {
        const onMeasure = vi.fn();
        render(<TestComponent onMeasure={onMeasure} />);
        expect(onMeasure).toHaveBeenCalledTimes(1);

        capturedCallback?.();

        expect(onMeasure).toHaveBeenCalledTimes(2);
    });

    it('desconecta o observer ao desmontar', () => {
        const { unmount } = render(<TestComponent onMeasure={vi.fn()} />);

        unmount();

        expect(disconnect).toHaveBeenCalledTimes(1);
    });

    it('sempre chama a versão mais recente de onMeasure (sem closure velha)', () => {
        const firstMeasure = vi.fn();
        const secondMeasure = vi.fn();
        const { rerender } = render(<TestComponent onMeasure={firstMeasure} />);
        expect(firstMeasure).toHaveBeenCalledTimes(1);

        // troca o callback sem desmontar — o efeito não deveria rodar de
        // novo (só depende da ref, estável), mas a próxima medição real
        // precisa usar a versão NOVA, não a capturada no mount.
        rerender(<TestComponent onMeasure={secondMeasure} />);
        capturedCallback?.();

        expect(secondMeasure).toHaveBeenCalledTimes(1);
        expect(firstMeasure).toHaveBeenCalledTimes(1);
    });

    // Navegador sem ResizeObserver (raro hoje): mede uma vez no mount e
    // segue sem observar, em vez de quebrar o app inteiro.
    it('sem ResizeObserver no navegador, mede uma vez no mount e não quebra', () => {
        vi.unstubAllGlobals();
        const originalWindowRO = window.ResizeObserver;
        const originalGlobalRO = globalThis.ResizeObserver;
        // @ts-expect-error — simulando navegador sem suporte a ResizeObserver
        window.ResizeObserver = undefined;
        // @ts-expect-error — idem
        globalThis.ResizeObserver = undefined;

        const onMeasure = vi.fn();
        try {
            expect(() =>
                render(<TestComponent onMeasure={onMeasure} />),
            ).not.toThrow();
            expect(onMeasure).toHaveBeenCalledTimes(1);
        } finally {
            window.ResizeObserver = originalWindowRO;
            globalThis.ResizeObserver = originalGlobalRO;
        }
    });
});
