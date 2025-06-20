import * as React from 'react';
import {
    Bars3Icon as Bars3IconOutline,
    BriefcaseIcon as BriefcaseIconOutline,
    EnvelopeIcon as EnvelopeIconOutline,
    HomeIcon as HomeIconOutline,
    UserIcon as UserIconOutline,
    XMarkIcon as XMarkIconOutline,
} from '@heroicons/react/24/outline';

import {
    BriefcaseIcon as BriefcaseIconSolid,
    EnvelopeIcon as EnvelopeIconSolid,
    HomeIcon as HomeIconSolid,
    UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';

import styles from './styles.module.css';
import { MenuItem } from './menu-item';

export interface MenuItemPosition {
    x: string;
    y: string;
}

interface HamburgerMenuProps {
    colors?: {
        base?: string;
        active?: string;
    };
    positions?: Record<number, MenuItemPosition>;
}

const defaultColors = {
    base: '#d1d5db',
    active: 'gray',
};

const defaultPositions = {
    1: { x: '8.125rem', y: '0.625rem' },
    2: { x: '5.625rem', y: '3.125rem' },
    3: { x: '3.125rem', y: '5.625rem' },
    4: { x: '0.625rem', y: '8.125rem' },
};

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
    colors = defaultColors,
    positions = defaultPositions,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {isOpen && (
                <div className={styles.blurOverlay} onClick={toggleMenu} />
            )}

            <div
                className={`${styles.menuContainer}  ${
                    isOpen
                        ? 'w-[21.875rem] h-[21.875rem] -top-40 -left-40 bg-gray-300/90'
                        : 'w-11 h-11 top-4 left-4'
                }`}
            >
                <div
                    className={`${styles.menuButton} ${
                        isOpen
                            ? `top-44 left-44 w-11 h-11 rotate-45`
                            : 'inset-0'
                    }`}
                    style={{
                        backgroundColor: isOpen ? colors.active : colors.base,
                    }}
                    onClick={toggleMenu}
                >
                    {isOpen ? (
                        <XMarkIconOutline className="w-6 h-6 text-white rotate-45" />
                    ) : (
                        <Bars3IconOutline className="w-6 h-6 text-gray-500" />
                    )}
                </div>

                <MenuItem
                    IconOutline={HomeIconOutline}
                    IconSolid={HomeIconSolid}
                    position={positions[1]}
                    isOpen={isOpen}
                    label="Home"
                />
                <MenuItem
                    IconOutline={UserIconOutline}
                    IconSolid={UserIconSolid}
                    position={positions[2]}
                    isOpen={isOpen}
                    label="Sobre mim"
                />
                <MenuItem
                    IconOutline={BriefcaseIconOutline}
                    IconSolid={BriefcaseIconSolid}
                    position={positions[3]}
                    isOpen={isOpen}
                    label="Projetos"
                />
                <MenuItem
                    IconOutline={EnvelopeIconOutline}
                    IconSolid={EnvelopeIconSolid}
                    position={positions[4]}
                    isOpen={isOpen}
                    label="Contatos"
                />
            </div>
        </>
    );
};
