import { describe, expect, it } from 'vitest';

import { buildLightPath, RAMP_FRACTION } from './light-path';

const ROWS = [
    { top: 0, bottom: 0.5 },
    { top: 0.5, bottom: 1 },
];

describe('buildLightPath', () => {
    it('começa na bolinha fixa do topo e termina na do fim', () => {
        const { input, output } = buildLightPath(ROWS);

        expect(input[0]).toBe(0);
        expect(output[0]).toBe(0);
        expect(input.at(-1)).toBe(1);
        expect(output.at(-1)).toBe(1);
    });

    it('pausa a luz no centro de cada linha durante a parte central dela', () => {
        const { input, output } = buildLightPath(ROWS, 0.25);

        expect(input).toEqual([0, 0.125, 0.375, 0.625, 0.875, 1]);
        expect(output).toEqual([0, 0.25, 0.25, 0.75, 0.75, 1]);
    });

    it('marca a chegada da luz no início de cada platô', () => {
        const { arrivals } = buildLightPath(ROWS, 0.25);

        expect(arrivals).toEqual([0.125, 0.625]);
    });

    it('usa RAMP_FRACTION quando a rampa não é informada', () => {
        const { arrivals } = buildLightPath([{ top: 0, bottom: 1 }]);

        expect(arrivals).toEqual([RAMP_FRACTION]);
    });

    it('mantém o progresso sempre crescente, mesmo com linhas coladas', () => {
        const { input } = buildLightPath(ROWS);

        const isNonDecreasing = input.every(
            (value, i) => i === 0 || value >= input[i - 1],
        );
        expect(isNonDecreasing).toBe(true);
    });

    it('sem linhas, a luz desce em linha reta do topo ao fim', () => {
        expect(buildLightPath([])).toEqual({
            input: [0, 1],
            output: [0, 1],
            arrivals: [],
        });
    });
});
