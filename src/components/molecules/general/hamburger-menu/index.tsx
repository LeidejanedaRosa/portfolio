import { useState } from "react";

import { DarkModeButton } from "../dark-mode";

import { MenuButton } from "./menu-button";

import styles from "./styles.module.css";

export const HamburgerMenu = () => {
  
  const [darkMode, setDarkMode] = useState(false);

  return (
    
    <nav className={`${styles.nav} ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className={styles.navContainer}>
        <MenuButton />
        <DarkModeButton darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>      
    </nav>
    
  );
};