import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useIsDesktop } from './use-is-desktop';

function mockMatchMedia(matches: boolean) {
    const listeners: Array<(event: MediaQueryListEvent) => void> = [];

    vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({
            matches,
            addEventListener: (
                _: string,
                callback: (event: MediaQueryListEvent) => void,
            ) => {
                listeners.push(callback);
            },
            removeEventListener: vi.fn(),
        })),
    );

    return listeners;
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('useIsDesktop', () => {
    it('começa true quando a tela já é desktop', () => {
        mockMatchMedia(true);

        const { result } = renderHook(() => useIsDesktop());

        expect(result.current).toBe(true);
    });

    it('começa false quando a tela não é desktop', () => {
        mockMatchMedia(false);

        const { result } = renderHook(() => useIsDesktop());

        expect(result.current).toBe(false);
    });

    it('atualiza quando o media query muda', () => {
        const listeners = mockMatchMedia(false);
        const { result } = renderHook(() => useIsDesktop());

        expect(result.current).toBe(false);

        act(() => {
            listeners.forEach((callback) =>
                callback({ matches: true } as MediaQueryListEvent),
            );
        });

        expect(result.current).toBe(true);
    });
});
