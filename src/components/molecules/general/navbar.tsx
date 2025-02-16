import { useState } from "react";
import { Moon, Sun, Menu, Home, User, Briefcase, Mail } from "lucide-react";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  console.log("isOpen", isOpen);
  
    return (
    <header className={`fixed top-0 left-0 w-full p-4 z-50 ${darkMode ? ' text-white' : ' text-gray-900'}`}>
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <button onClick={() => setIsOpen(!isOpen)} className="relative w-12 h-12 flex items-center justify-center text-gray-200 dark:bg-gray-700 rounded-full shadow-md">
          <Menu size={24} />
        </button>

        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 flex items-center justify-center text-gray-200 dark:bg-gray-700 rounded-full shadow-md">
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Circular Menu */}
      {isOpen && (
        <div className="absolute top-0 left-10 flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 ">
            <div className="absolute w-52 h-52 border -left-32 -top-20 border-gray-900 rounded-full"></div>
            <a href="#home" className="absolute top-2 left-[60px] transform -translate-x-1/2 p-2 text-white dark:bg-gray-300 rounded-full shadow-md transition-all duration-300 ease-in-out opacity-0 scale-0 animate-item-1">
              <Home size={20} />
            </a>
            <a href="#about" className="absolute top-[55px] left-[45px] transform -translate-x-1/2 p-2 text-white dark:bg-gray-300 rounded-full shadow-md transition-all duration-300 ease-in-out opacity-0 scale-0 animate-item-2">
              <User size={20} />
            </a>
            <a href="#projects" className="absolute top-[90px] left-4 transform translate-x-1/2 p-2 text-white dark:bg-gray-300 rounded-full shadow-md transition-all duration-300 ease-in-out opacity-0 scale-0 animate-item-3">
              <Briefcase size={20} />
            </a>
            <a href="#contact" className="absolute top-[105px] -left-7 transform -translate-x-1/2 p-2 text-white dark:bg-gray-300 rounded-full shadow-md transition-all duration-300 ease-in-out opacity-0 scale-0 animate-item-4">
              <Mail size={20} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

