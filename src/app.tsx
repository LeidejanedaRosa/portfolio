import { domAnimation, LazyMotion } from 'framer-motion';

import { CookieConsentBanner } from './components/molecules/general/cookie-consent';
import { Layout } from './components/organisms/general/layout';
import { ConsentProvider } from './consent';
import { AboutMe } from './sections/about-me';
import { Contact } from './sections/contact';
import { Faq } from './sections/faq';
import { HomePage } from './sections/home';
import { Projects } from './sections/projects';
import { ThemeProvider } from './theme';

export const App = () => {
    return (
        <ThemeProvider>
            <ConsentProvider>
                {/* LazyMotion + domAnimation: nenhuma seção usa drag, layout
                    animations ou AnimatePresence — só transform/opacity via
                    scroll (parallax da Home, timeline de Projetos/Experiência).
                    Os componentes `motion.*` completos (usados antes) trazem
                    TODOS os recursos do framer-motion no bundle mesmo sem
                    usar a maioria deles; trocar por `m.*` (ver cada
                    componente) com esse provider economiza ~200KB
                    (pré-minificação) sem perder nada do que já tínhamos. */}
                <LazyMotion features={domAnimation}>
                    <Layout>
                        <HomePage />
                        <AboutMe />
                        <Projects />
                        <Faq />
                        <Contact />
                    </Layout>
                </LazyMotion>
                <CookieConsentBanner />
            </ConsentProvider>
        </ThemeProvider>
    );
};
