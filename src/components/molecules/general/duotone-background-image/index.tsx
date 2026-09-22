import { motion, type MotionValue } from 'framer-motion';

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
            <motion.img
                src={src}
                alt=""
                aria-hidden="true"
                width={width}
                height={height}
                fetchPriority="high"
                style={{ y: parallaxY }}
                className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/70 to-background/25"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-accent/0 via-accent/10 to-accent/25"
            />
        </>
    );
};
