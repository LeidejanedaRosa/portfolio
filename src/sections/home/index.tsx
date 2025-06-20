import bgHome from '../../assets/images/bg-home.jpeg';

// import profilePhoto from "@assets/images/LeidejanedaRosaProfile.png";

export const HomePage = () => {
    return (
        <>
            <div className="relative">
                <div className="relative h-screen">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-blue-950"
                        style={{
                            backgroundImage: `url(${bgHome})`,
                            filter: 'brightness(70%)',
                        }}
                    ></div>
                    <div className="flex flex-col justify-end h-full relative">
                        <h1 className="text-4xl bg-white/70 w-screen text-center text-blue-900 text-shadow-xl font-sacramento font-extrabold leading-loose">
                            {' '}
                            Leidejane da Rosa
                        </h1>
                        <div className="flex items-center justify-center w-screen bg-blue-950 h-20 ">
                            <p className=" text-white text-center text-shadow-black w-[300px] mx-auto">
                                Aqui você encontra meus projetos e informações
                                sobre mim.
                            </p>
                        </div>
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
