import { useState } from "react";
import { 
  BriefcaseIcon, 
  EnvelopeIcon, 
  HomeIcon, 
  UserIcon 
} from "@heroicons/react/24/outline";
import { HeroIcon } from "./menu-item";
import styles from "./styles.module.css";

const tabs = [
  { id: "home", icon: HomeIcon, label: "Home" },
  { id: "aboutMe", icon: UserIcon, label: "Sobre mim" },
  { id: "projects", icon: BriefcaseIcon, label: "Projetos" },
  { id: "contact", icon: EnvelopeIcon, label: "Contatos" },
];

export const NavBar = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className={styles.navbarContainer}>
      {tabs.map(({ id, icon, label }) => (
        <div key={id} className="relative group ">
          <button 
            onClick={() => setActiveTab(id)} 
            className={`${styles.navbarButton} ${activeTab === id ? "-translate-y-5 " : ""}`}
          >
            <HeroIcon icon={icon} />
          </button>
          <span className={`${styles.navbarSpan} group-hover:opacity-100`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
