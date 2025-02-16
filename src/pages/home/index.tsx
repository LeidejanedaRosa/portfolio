import { NavBar } from "@src/components/molecules/general/navbar";

const bgHome = require('@assets/images/bg-home.png');

export const HomePage = () => {
  return (
    <>
    <NavBar />
    <div 
      className="bg-cover bg-center h-screen opacity-30"
      style={{ backgroundImage: `url(${bgHome})` }} 

    >
    </div>
    </>
  );
};
