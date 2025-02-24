

import * as React from "react";
import { 
  Bars3Icon, 
  BriefcaseIcon, 
  EnvelopeIcon, 
  HomeIcon, 
  UserIcon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";

import styles from "./styles.module.css";


interface MenuItemPosition {
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

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  colors = {
    base: "#d1d5db",
    active: "gray"
  },
  positions = {
    1: { x: "8.125rem", y: "0.625rem" },
    2: { x: "5.625rem", y: "3.125rem" },
    3: { x: "3.125rem", y: "5.625rem" },
    4: { x: "0.625rem", y: "8.125rem" }
  }
 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
 
  return (
    <div 
    className={`${styles.menuContainer} ${isOpen ? "w-[21.875rem] h-[21.875rem] -top-40 -left-40" : "w-11 h-11 top-4 left-4"}`}   
    style={{backgroundColor: isOpen ? colors.base : colors.active}}
    onClick={() => setIsOpen(!isOpen)}
    >
      <div 
      className={`${styles.menuButton} ${isOpen ? `top-44 left-44 w-11 h-11 rotate-45` : "inset-0"}`}
      style={{backgroundColor: isOpen ? colors.active : colors.base}}>
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-500" />
        )}
      </div>

      
      <HomeIcon 
      className={`${styles.heroicons} ${isOpen ? "top-40 left-40 z-50" : "top-1 left-1 z-10"}`}
      style={isOpen ? { transform: `translate(${positions[1].x}, ${positions[1].y})` } : {}}
      />
      <UserIcon 
        className={`${styles.heroicons} ${isOpen ? "top-44 left-44 z-50" : "top-1 left-1 z-10"}`}
        style={isOpen ? { transform: `translate(${positions[2].x}, ${positions[2].y})` } : {}}
      />
      <BriefcaseIcon 
        className={`${styles.heroicons} ${isOpen ? "top-44 left-44 z-50" : "top-1 left-1 z-10"}`}
        style={isOpen ? { transform: `translate(${positions[3].x}, ${positions[3].y})` } : {}}
      />
      <EnvelopeIcon 
        className={`${styles.heroicons} ${isOpen ? "top-40 left-40 z-50" : "top-1 left-1 z-10"}`}
        style={isOpen ? { transform: `translate(${positions[4].x}, ${positions[4].y})` } : {}}
      />

    </div>
  );
};