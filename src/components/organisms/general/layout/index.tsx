import { useState } from 'react';

import { NavBar } from '../../../molecules/general/navbar';
import { HamburgerMenu } from '../../../molecules/general/hamburger-menu';
import { DarkModeButton } from '../../../molecules/general/dark-mode';

export function Layout() {
    const [darkMode, setDarkMode] = useState(false);
    return (
        <>
            <div className="md:block">
                <NavBar />
            </div>
            <div className="block md:hidden">
                <HamburgerMenu />
            </div>
            <div className="fixed top-0 right-0 p-4 z-50 ">
                <DarkModeButton darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
        </>
    );
}
