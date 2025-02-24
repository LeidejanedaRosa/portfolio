import * as React from "react";
import styles from "./styles.module.css";

interface MenuItemProps {
  IconOutline: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  IconSolid: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  position: { x: string; y: string };
  isOpen: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ IconOutline, IconSolid, position, isOpen }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const topClass = isOpen ? (position.x === "5.625rem" || position.x === "3.125rem" ? "top-44" : "top-40") : "top-1";
    const leftClass = isOpen ? (position.y === "3.125rem" || position.y === "5.625rem" ? "left-44" : "left-40") : "left-1";
  
    return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {isHovered ? (
        <IconSolid 
          className={`${styles.heroicons} ${topClass} ${leftClass} absolute `}
          style={isOpen ? { transform: `translate(${position.x}, ${position.y})` } : {}}
        />
      ) : (
        <IconOutline 
          className={`${styles.heroicons} ${topClass} ${leftClass} absolute `}
          style={isOpen ? { transform: `translate(${position.x}, ${position.y})` } : {}}
        />
      )}
    </div>
  );
};

