interface ThemedBackgroundImageProps {
    lightSrc: string;
    darkSrc: string;
    lightScrim?: string;
    darkScrim?: string;
}

export const ThemedBackgroundImage = ({
    lightSrc,
    darkSrc,
    lightScrim = 'rgba(248, 250, 252, 0.88)',
    darkScrim = 'rgba(15, 23, 42, 0.85)',
}: ThemedBackgroundImageProps) => {
    return (
        <>
            <img
                src={lightSrc}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover dark:hidden"
            />
            <img
                src={darkSrc}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 hidden h-full w-full object-cover dark:block"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 dark:hidden"
                style={{ backgroundColor: lightScrim }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
                style={{ backgroundColor: darkScrim }}
            />
        </>
    );
};
