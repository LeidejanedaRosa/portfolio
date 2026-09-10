import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

// vitest-axe 0.1 ainda augmenta o `namespace Vi` (Vitest 1/2).
// No Vitest 3 os matchers vivem no módulo 'vitest' — refazemos aqui.
// A assinatura genérica precisa bater com a do Vitest para o merge de interfaces.
declare module 'vitest' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Assertion<T = any> extends AxeMatchers {}
    interface AsymmetricMatchersContaining extends AxeMatchers {}
}
