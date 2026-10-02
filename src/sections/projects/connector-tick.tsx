import { m, type MotionValue } from 'framer-motion';

// Comprimento do traço que liga a bolinha central ao card/iframe: metade do
// gap do grid (1.5rem) + o padding que afasta o card dessa borda (3rem) —
// preso aos mesmos valores em rem das classes do grid em `TimelineRow`;
// mudar um sem o outro faz o traço parar antes da borda.
const TICK_LENGTH = 'w-[4.7rem]';

export function ConnectorTick({
    direction,
    scaleX,
}: {
    direction: 'left' | 'right';
    scaleX: MotionValue<number> | number;
}) {
    return (
        <m.span
            aria-hidden="true"
            style={{ scaleX }}
            className={`absolute top-1/2 hidden h-0.5 ${TICK_LENGTH} -translate-y-1/2 bg-accent/50 md:block ${
                direction === 'left'
                    ? 'right-1/2 origin-right'
                    : 'left-1/2 origin-left'
            }`}
        />
    );
}
