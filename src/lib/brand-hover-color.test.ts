import { describe, expect, it } from 'vitest';

import { brandHoverColor } from './brand-hover-color';

describe('brandHoverColor', () => {
    it('usa a cor da marca quando a luminância é intermediária', () => {
        expect(brandHoverColor('61DAFB')).toBe('#61DAFB'); // React
    });

    it('cai no accent para marcas quase pretas', () => {
        expect(brandHoverColor('0A0A0A')).toBe('rgb(var(--color-accent))');
    });

    it('cai no accent para marcas quase brancas', () => {
        expect(brandHoverColor('FFFFFF')).toBe('rgb(var(--color-accent))');
    });
});
