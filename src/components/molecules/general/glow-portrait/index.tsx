interface GlowPortraitProps {
    src: string;
    alt: string;
}

export const GlowPortrait = ({ src, alt }: GlowPortraitProps) => {
    return (
        <div className="relative mx-auto aspect-square h-64 sm:h-72 lg:h-80">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 rounded-full bg-accent/20 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgb(var(--color-accent)/0.3),transparent_65%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[75%] w-auto -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/60"
            />
            <span
                aria-hidden="true"
                className="absolute right-[5%] top-[20%] z-20 h-4 w-4 rotate-6 bg-accent/50"
            />
            <span
                aria-hidden="true"
                className="absolute right-[2%] top-[32%] z-20 h-3 w-3 -rotate-12 bg-accent/30"
            />
            <img
                src={src}
                alt={alt}
                width={427}
                height={585}
                className="absolute inset-0 z-10 h-full w-full object-cover object-top"
            />
        </div>
    );
};
