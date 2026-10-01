/**
 * Cor de hover pra um ícone/borda de marca (hex de `simple-icons`, sem o
 * `#`). Marcas quase pretas ou quase brancas somem contra o fundo de UM dos
 * temas — nesses casos o hover usa o accent do design system em vez da cor
 * real da marca.
 *
 * `theme` opcional: sem ele (uso original, só no ícone), cai pro accent nos
 * dois extremos — simples, mas descarta até cores que seriam perfeitamente
 * visíveis num dos dois temas (ex.: o preto do GitHub lê bem no tema claro,
 * só some no escuro). Passando o tema, o fallback fica de um lado só: preto
 * só cai pro accent no escuro, branco só cai pro accent no claro.
 */
export function brandHoverColor(hex: string, theme?: 'light' | 'dark'): string {
    const value = parseInt(hex, 16);
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = value & 0xff;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const invisibleOnDark = luminance < 0.12;
    const invisibleOnLight = luminance > 0.9;
    const fallsBack =
        theme === 'light'
            ? invisibleOnLight
            : theme === 'dark'
              ? invisibleOnDark
              : invisibleOnDark || invisibleOnLight;

    return fallsBack ? 'rgb(var(--color-accent))' : `#${hex}`;
}
