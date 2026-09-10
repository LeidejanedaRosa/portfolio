import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// vitest-axe 0.1 não registra o matcher sozinho — fazemos manualmente.
expect.extend(axeMatchers);

// Cada teste começa com um DOM limpo — sem vazamento de estado entre casos.
afterEach(() => {
    cleanup();
});
