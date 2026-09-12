import { afterEach, describe, expect, it } from 'vitest';

import { __resetLoadGTMForTests, loadGTM } from './load-gtm';

afterEach(() => {
    __resetLoadGTMForTests();
    delete window.dataLayer;
    document
        .querySelectorAll('script[src*="googletagmanager.com"]')
        .forEach((el) => el.remove());
});

describe('loadGTM', () => {
    it('injeta o script do GTM com o container id certo', () => {
        loadGTM('GTM-TEST123');

        const script = document.head.querySelector(
            'script[src*="googletagmanager.com"]',
        );
        expect(script).not.toBeNull();
        expect(script?.getAttribute('src')).toContain('GTM-TEST123');
    });

    it('não injeta duas vezes (guard contra dupla montagem em dev/StrictMode)', () => {
        loadGTM('GTM-TEST123');
        loadGTM('GTM-TEST123');

        const scripts = document.head.querySelectorAll(
            'script[src*="googletagmanager.com"]',
        );
        expect(scripts).toHaveLength(1);
    });
});
