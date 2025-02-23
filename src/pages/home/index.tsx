import { useEffect, useState } from "react";
import bgHome from "@assets/images/bg-home.png";
import profilePhoto from "@assets/images/LeidejanedaRosaProfile.png";
import { HamburgerMenu } from "../../components/molecules/general/hamburger-menu";


export const HomePage = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
   
  const handleScroll = () => {
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <HamburgerMenu />
      <div className="relative">
        <div className="relative h-screen z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 z-10"
            style={{ backgroundImage: `url(${bgHome})` }}
          ></div>
          <div className="flex flex-col items-center justify-end h-full relative z-10">
            <h1 className="text-4xl font-bold text-blue-950 font-sacramento">Leidejane da Rosa</h1>
            <p className="w-[18.75rem] text-gray-700 text-center mb-28">Aqui você encontra meus projetos e informações sobre mim.</p>
          </div>
        </div>

        <div
          id="photo-section"
          className="z-30 w-full h-full transition-all duration-300 ease-in-out"
          style={{
            backgroundImage: `url(${profilePhoto})`,
            height: '100vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(-${lastScrollY}px)`,
            opacity: 100
          }}
        />
      </div>
    </>
  );
};