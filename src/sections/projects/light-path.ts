/** Faixa vertical de uma linha da timeline, em fração (0–1) da altura da
 * lista — mesmo referencial do `scrollYProgress`. */
export interface RowBounds {
    top: number;
    bottom: number;
}

export interface LightPath {
    /** Progresso de scroll (0–1) de cada ponto de controle. */
    input: number[];
    /** Posição da luz (0–1 da altura da lista) em cada ponto de controle. */
    output: number[];
    /** Progresso em que a luz chega à bolinha de cada linha — é quando a
     * bolinha enche e o traço abre. */
    arrivals: number[];
}

// Fração de cada linha, em cada ponta, em que a luz desliza em vez de ficar
// parada. Com 0.15, a luz pausa na bolinha durante os 70% centrais do card.
// Maior que isso, a luz demora a chegar num card que já está inteiro na tela.
export const RAMP_FRACTION = 0.15;

/**
 * Caminho da luz em "escada": parada na bolinha (centro) de cada linha
 * enquanto a linha de leitura atravessa a parte central dela, deslizando até
 * a próxima bolinha no resto. Começa na bolinha fixa do topo (0) e termina na
 * do fim (1).
 */
export function buildLightPath(
    rows: readonly RowBounds[],
    ramp = RAMP_FRACTION,
): LightPath {
    const input = [0];
    const output = [0];
    const arrivals: number[] = [];

    for (const { top, bottom } of rows) {
        const center = (top + bottom) / 2;
        const edge = (bottom - top) * ramp;

        input.push(top + edge, bottom - edge);
        output.push(center, center);
        arrivals.push(top + edge);
    }

    input.push(1);
    output.push(1);

    return { input, output, arrivals };
}
