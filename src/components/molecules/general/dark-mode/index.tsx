import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

import styles from './styles.module.css';

interface DarkModeButtonProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}

export const DarkModeButton = ({
    darkMode,
    setDarkMode,
}: DarkModeButtonProps) => {
    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className={styles.darkModeButton}
        >
            {darkMode ? (
                <SunIcon className="w-7 h-7 text-gray-500" />
            ) : (
                <MoonIcon className="w-7 h-7 text-gray-500" />
            )}
        </button>
    );
};
