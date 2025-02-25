import { FC } from "react";
import styles from "./styles.module.css";

interface IconProps {
  icon: FC<{ className?: string }>;
}

export  const HeroIcon = ({ icon: IconComponent }: IconProps) => {
  return (
    <div className={styles.heroicons}>
      <IconComponent className="w-6 h-6" />
    
    </div>
  );
}
