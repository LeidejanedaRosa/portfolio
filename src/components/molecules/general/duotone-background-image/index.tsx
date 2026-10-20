import { m, type MotionValue } from 'framer-motion';

interface DuotoneBackgroundImageProps {
    src: string;
    width: number;
    height: number;
    parallaxY?: MotionValue<number> | number;
}

export const DuotoneBackgroundImage = ({
    src,
    width,
    height,
    parallaxY = 0,
}: DuotoneBackgroundImageProps) => {
    return (
        <>
            <m.img
                src={src}
                alt=""
                aria-hidden="true"
                width={width}
                height={height}
                fetchPriority="high"
                style={{ y: parallaxY }}
                className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
            />
            {/* dark:via/to mais opacos: a imagem (clara, só uma, sem par
                clara/escura como as outras seções) fica com o traço do
                lápis/papel muito claro vazando por trás do texto no modo
                escuro onde o gradiente do modo claro já ficava fraco —
                pior ainda no mobile, onde o parágrafo ocupa quase a
                largura toda (achado real da Leidejane, visível num print
                pro LinkedIn). */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-background via-background/70 to-background/25 dark:via-background/90 dark:to-background/60"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-accent/0 via-accent/10 to-accent/25"
            />
        </>
    );
};
