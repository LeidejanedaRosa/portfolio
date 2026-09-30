import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

function mockMatchMedia(matches: boolean) {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();

    vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) =>
            ({
                matches,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: (
                    _event: string,
                    listener: (event: MediaQueryListEvent) => void,
                ) => {
                    listeners.add(listener);
                },
                removeEventListener: (
                    _event: string,
                    listener: (event: MediaQueryListEvent) => void,
                ) => {
                    listeners.delete(listener);
                },
                dispatchEvent: () => false,
            }) as MediaQueryList,
    );

    return {
        change(nextMatches: boolean) {
            listeners.forEach((listener) =>
                listener({ matches: nextMatches } as MediaQueryListEvent),
            );
        },
    };
}

describe('usePrefersReducedMotion', () => {
    it('lê a preferência do SO na montagem', () => {
        mockMatchMedia(true);
        const { result } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(true);
    });

    it('reage a mudança de preferência durante a sessão', () => {
        const media = mockMatchMedia(false);
        const { result } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(false);

        act(() => media.change(true));

        expect(result.current).toBe(true);
    });
});
