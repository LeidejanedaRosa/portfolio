import { Menu } from "lucide-react";
import styles from "./styles.module.css";
import { MenuItems } from "../menu-items";
import { useState } from "react";

export const MenuButton = () => {
const [isOpen, setIsOpen] = useState(false);

const handleClose = () => {
  setTimeout(() => {
      setIsOpen(false);
  }, 300); 
};
   return (
    <>
    <button onClick={() => setIsOpen(!isOpen)} className={styles.menuButton}>
      <Menu size={24} />
    </button>
    <div>
      {isOpen && <div className={styles.overlay} onClick={handleClose} />}
      <MenuItems isOpen={isOpen} />
    </div>
    </>
  );
};