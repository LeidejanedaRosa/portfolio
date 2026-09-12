import { CookieConsentBanner } from './components/molecules/general/cookie-consent';
import { Layout } from './components/organisms/general/layout';
import { ConsentProvider } from './consent';
import { AboutMe } from './sections/about-me';
import { Contact } from './sections/contact';
import { HomePage } from './sections/home';
import { Projects } from './sections/projects';
import { ThemeProvider } from './theme';

export const App = () => {
    return (
        <ThemeProvider>
            <ConsentProvider>
                <Layout>
                    <HomePage />
                    <AboutMe />
                    <Projects />
                    <Contact />
                </Layout>
                <CookieConsentBanner />
            </ConsentProvider>
        </ThemeProvider>
    );
};
