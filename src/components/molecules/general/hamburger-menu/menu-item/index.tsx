import * as React from 'react';
import styles from './styles.module.css';

interface MenuItemProps {
    IconOutline: React.ComponentType<{
        className?: string;
        style?: React.CSSProperties;
    }>;
    IconSolid: React.ComponentType<{
        className?: string;
        style?: React.CSSProperties;
    }>;
    position: { x: string; y: string };
    isOpen: boolean;
    label: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
    IconOutline,
    IconSolid,
    position,
    isOpen,
    label,
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const topClass = isOpen
        ? position.x === '5.625rem' || position.x === '3.125rem'
            ? 'top-44'
            : 'top-[10.625rem]'
        : 'top-1';
    const leftClass = isOpen
        ? position.y === '3.125rem' || position.y === '5.625rem'
            ? 'left-44'
            : 'left-[10.3125rem]'
        : 'left-1';

    const topClassLabel = isOpen
        ? position.x === '5.625rem' || position.x === '3.125rem'
            ? 'top-[12.8125rem]'
            : 'top-[12.5rem]'
        : 'top-1';
    const leftClassLabel = isOpen
        ? position.y === '3.125rem' || position.y === '5.625rem'
            ? 'left-[8.75rem]'
            : 'left-[8.125rem]'
        : 'left-1';

    return (
        <div
            className="relative flex items-center "
            onMouseEnter={() => setIsHovered(!isHovered)}
            onMouseLeave={() => setIsHovered(!isHovered)}
            style={
                isOpen
                    ? { transform: `translate(${position.x}, ${position.y})` }
                    : {}
            }
        >
            {isHovered ? (
                <IconSolid
                    className={`${styles.heroicons} ${topClass} ${leftClass} absolute`}
                />
            ) : (
                <IconOutline
                    className={`${styles.heroicons} ${topClass} ${leftClass} absolute `}
                />
            )}
            {isOpen && (
                <span
                    className={`
            ${styles.menuItemLabel} 
            ${topClassLabel}
            ${leftClassLabel}                   
            ${
                isHovered
                    ? 'visible translate-x-9 opacity-100'
                    : 'invisible translate-x-0 opacity-0'
            }`}
                >
                    {label}
                </span>
            )}
        </div>
    );
};
