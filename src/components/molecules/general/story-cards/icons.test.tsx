import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
    BriefcaseIcon,
    CompassIcon,
    GiftIcon,
    GraduationCapIcon,
    RefreshIcon,
} from './icons';

const ICONS = [
    GraduationCapIcon,
    GiftIcon,
    RefreshIcon,
    BriefcaseIcon,
    CompassIcon,
];

describe('story-cards icons', () => {
    it('cada ícone renderiza um svg decorativo (aria-hidden)', () => {
        ICONS.forEach((Icon) => {
            const { container } = render(<Icon />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute('aria-hidden', 'true');
        });
    });
});
