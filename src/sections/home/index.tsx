import { motion, useScroll, useTransform } from 'framer-motion';

import bgHome from '../../assets/images/bg-home.jpeg';

import profilePhoto from '@assets/images/LeidejanedaRosaProfile.png';

export const HomePage = () => {
    const { scrollY } = useScroll();

    const y = useTransform(scrollY, [0, 800], [700, 0]);

    return (
        <>
            <div className="relative h-screen w-screen">
                <div className="relative h-screen ">
                    <div
                        className="fixed inset-0 bg-cover bg-center bg-blue-950 opacity-30 "
                        style={{
                            backgroundImage: `url(${bgHome})`,
                            filter: 'brightness(70%)',
                        }}
                    ></div>
                    <div className="fixed flex flex-col justify-end h-full z-10">
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
                <motion.div
                    id="photo-section"
                    style={{
                        backgroundImage: `url(${profilePhoto})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        y,
                        width: '500px',
                        height: '100vh',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
            </div>
        </>
    );
};
