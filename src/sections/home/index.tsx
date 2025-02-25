// import { useState } from "react";
import bgHome from "@assets/images/bg-home.png";
import { NavBar } from "../../components/molecules/general/navbar";

// import { HamburgerMenu } from "../../components/molecules/general/hamburger-menu";
// import profilePhoto from "@assets/images/LeidejanedaRosaProfile.png";
// import { DarkModeButton } from "../../components/molecules/general/dark-mode";


export const HomePage = () => {

  // const [darkMode, setDarkMode] = useState(false);
  return (
    <>
      {/* <HamburgerMenu /> */}
      <NavBar />
      {/* <DarkModeButton darkMode={darkMode} setDarkMode={setDarkMode} /> */}
      <div className="relative">
        <div className="relative h-screen">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgHome})` }}
          ></div>
          <div className="flex flex-col items-center justify-end h-full relative">
           
            <h1 className="text-4xl bg-white/70 w-screen text-center text-blue-900 text-shadow-xl font-sacramento font-extrabold leading-loose"  
            > Leidejane da Rosa </h1>    
            <p className=" text-white text-center w-screen bg-blue-950 text-shadow-black mb-28">Aqui você encontra meus projetos e informações sobre mim.</p>
          </div>
        </div>

        {/* <div
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
        /> */}
      </div>
    </>
  );
};