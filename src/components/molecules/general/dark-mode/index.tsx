import { Moon, Sun } from "lucide-react";
import styles from "./styles.module.css";

interface DarkModeButtonProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export const DarkModeButton = ({ darkMode, setDarkMode }: DarkModeButtonProps) => {
  return (
    <button onClick={() => setDarkMode(!darkMode)} className={styles.darkModeButton}>
      {darkMode ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};