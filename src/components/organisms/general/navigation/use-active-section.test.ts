import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useActiveSection } from './use-active-section';

type IOCallback = (entries: IntersectionObserverEntry[]) => void;

let capturedCallback: IOCallback;
const observe = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
    vi.stubGlobal(
        'IntersectionObserver',
        vi.fn((cb: IOCallback) => {
            capturedCallback = cb;
            return {
                observe,
                unobserve: vi.fn(),
                disconnect,
                takeRecords: () => [],
            };
        }),
    );
    document.body.innerHTML =
        '<section id="home"></section><section id="about"></section>';
});

afterEach(() => {
    vi.unstubAllGlobals();
    observe.mockClear();
    disconnect.mockClear();
});

const IDS = ['home', 'about'] as const;

const entry = (id: string, isIntersecting: boolean, ratio: number) =>
    ({
        target: document.getElementById(id),
        isIntersecting,
        intersectionRatio: ratio,
    }) as unknown as IntersectionObserverEntry;

describe('useActiveSection', () => {
    it('começa na primeira seção', () => {
        const { result } = renderHook(() => useActiveSection(IDS));
        expect(result.current).toBe('home');
    });

    it('observa cada seção existente no DOM', () => {
        renderHook(() => useActiveSection(IDS));
        expect(observe).toHaveBeenCalledTimes(2);
    });

    it('ativa a seção mais visível quando o observer dispara', () => {
        const { result } = renderHook(() => useActiveSection(IDS));

        act(() => {
            capturedCallback([
                entry('about', true, 0.9),
                entry('home', true, 0.2),
            ]);
        });

        expect(result.current).toBe('about');
    });

    it('mantém a última ativa quando nenhuma seção está intersectando', () => {
        const { result } = renderHook(() => useActiveSection(IDS));

        act(() => capturedCallback([entry('about', true, 0.5)]));
        expect(result.current).toBe('about');

        act(() => capturedCallback([entry('about', false, 0)]));
        expect(result.current).toBe('about');
    });

    it('não troca para uma seção pouco visível quando outra, mais visível, não mudou', () => {
        const { result } = renderHook(() => useActiveSection(IDS));

        // "home" 80% visível; "about" fora
        act(() =>
            capturedCallback([
                entry('home', true, 0.8),
                entry('about', false, 0),
            ]),
        );
        expect(result.current).toBe('home');

        // callback parcial: só "about" entrando com 20% — "home" continua 80%
        act(() => capturedCallback([entry('about', true, 0.2)]));
        expect(result.current).toBe('home');

        // "about" passa a dominar
        act(() => capturedCallback([entry('about', true, 0.9)]));
        expect(result.current).toBe('about');
    });

    it('desconecta o observer ao desmontar', () => {
        const { unmount } = renderHook(() => useActiveSection(IDS));
        unmount();
        expect(disconnect).toHaveBeenCalled();
    });
});
