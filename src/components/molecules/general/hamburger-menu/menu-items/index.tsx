import { HomeIcon, UserIcon, BriefcaseIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import styles from "./styles.module.css";

interface MenuItemsProps {
  isOpen: boolean;
}

interface MenuItemProps {
  href: string;
  icon:  React.ReactElement;
  position: string;
  isOpen: boolean;
  openStyle: string;
  closeStyle: string;
  animationClass: string;
}

const MenuItem = ({ href, icon, position, isOpen, openStyle, closeStyle, animationClass }: MenuItemProps) => (
  <a href={href} className={`
    ${styles.menuItems} ${position}
    ${isOpen ? `${openStyle} ${animationClass}` : `${closeStyle} ${animationClass}-reverse`}
  `}>
    {icon}
  </a>
);

export const MenuItems = ({ isOpen }: MenuItemsProps) => {
  return (
    <div className={styles.menu}>
      <div className={styles.menuContainer}>
        <div className={
          isOpen 
            ? `${styles.menuBorderOpen} animate-item-1` 
            : `${styles.menuBorderClose} animate-item-1-reverse`
        }></div>
        
        <MenuItem 
          href="#home" 
          icon={<HomeIcon className={styles.heroicons}/>} 
          position="top-2 left-[3.75rem]" 
          isOpen={isOpen} 
          openStyle={styles.homeOpen} 
          closeStyle={styles.homeClose} 
          animationClass="animate-item-2" 
        />
        <MenuItem 
          href="#about" 
          icon={<UserIcon className={styles.heroicons}/>} 
          position="top-[3.4375rem] left-[2.8125rem]" 
          isOpen={isOpen} 
          openStyle={styles.aboutOpen} 
          closeStyle={styles.aboutClose} 
          animationClass="animate-item-3" 
        />
        <MenuItem 
          href="#projects" 
          icon={<BriefcaseIcon className={styles.heroicons}/>} 
          position="top-[5.625rem] left-4" 
          isOpen={isOpen} 
          openStyle={styles.projectsOpen} 
          closeStyle={styles.projectsClose} 
          animationClass="animate-item-4" 
        />
        <MenuItem 
          href="#contact" 
          icon={<EnvelopeIcon className={styles.heroicons}/>} 
          position="top-[6.5625rem] -left-8" 
          isOpen={isOpen} 
          openStyle={styles.contactOpen} 
          closeStyle={styles.contactClose} 
          animationClass="animate-item-5" 
        />
      </div>
    </div>
  );
};