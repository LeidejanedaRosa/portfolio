import { useEffect, useState } from 'react';

const DESKTOP_QUERY = '(min-width: 1024px)';

export function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia(DESKTOP_QUERY).matches,
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_QUERY);
        const handleChange = (event: MediaQueryListEvent) =>
            setIsDesktop(event.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isDesktop;
}
