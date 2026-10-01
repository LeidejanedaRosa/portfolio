import { describe, expect, it } from 'vitest';

import { brandHoverColor } from './brand-hover-color';

describe('brandHoverColor', () => {
    it('usa a cor da marca quando a luminância é intermediária', () => {
        expect(brandHoverColor('61DAFB')).toBe('#61DAFB'); // React
    });

    it('cai no accent para marcas quase pretas', () => {
        expect(brandHoverColor('0A0A0A')).toBe('var(--color-accent)');
    });

    it('cai no accent para marcas quase brancas', () => {
        expect(brandHoverColor('FFFFFF')).toBe('var(--color-accent)');
    });

    it('com theme "light", mantém marca quase preta (lê bem no claro) e só cai pro accent se for quase branca', () => {
        expect(brandHoverColor('0A0A0A', 'light')).toBe('#0A0A0A');
        expect(brandHoverColor('FFFFFF', 'light')).toBe('var(--color-accent)');
    });

    it('com theme "dark", mantém marca quase branca (lê bem no escuro) e só cai pro accent se for quase preta', () => {
        expect(brandHoverColor('FFFFFF', 'dark')).toBe('#FFFFFF');
        expect(brandHoverColor('0A0A0A', 'dark')).toBe('var(--color-accent)');
    });
});
