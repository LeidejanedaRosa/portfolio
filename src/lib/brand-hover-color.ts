/**
 * Cor de hover pra um ícone de marca (hex de `simple-icons`, sem o `#`).
 * Marcas quase pretas ou quase brancas somem no tema oposto — nesses casos
 * o hover usa o accent do design system em vez da cor real da marca.
 */
export function brandHoverColor(hex: string): string {
    const value = parseInt(hex, 16);
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = value & 0xff;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance < 0.12 || luminance > 0.9
        ? 'rgb(var(--color-accent))'
        : `#${hex}`;
}
