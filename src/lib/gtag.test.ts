import { afterEach, describe, expect, it } from 'vitest';

import { gtag } from './gtag';

afterEach(() => {
    delete window.dataLayer;
});

describe('gtag', () => {
    it('empurra os argumentos pro dataLayer, criando-o se preciso', () => {
        gtag('consent', 'update', { analytics_storage: 'granted' });

        expect(window.dataLayer).toHaveLength(1);
        expect(window.dataLayer![0]).toEqual([
            'consent',
            'update',
            { analytics_storage: 'granted' },
        ]);
    });

    it('acumula chamadas em ordem', () => {
        gtag('consent', 'default', { analytics_storage: 'denied' });
        gtag('consent', 'update', { analytics_storage: 'granted' });

        expect(window.dataLayer).toHaveLength(2);
    });
});
