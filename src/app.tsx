import { Layout } from './components/organisms/general/layout';
import { AboutMe } from './sections/about-me';
import { Contact } from './sections/contact';
import { HomePage } from './sections/home';
import { Projects } from './sections/projects';
import { ThemeProvider } from './theme';

export const App = () => {
    return (
        <ThemeProvider>
            <Layout>
                <HomePage />
                <AboutMe />
                <Projects />
                <Contact />
            </Layout>
        </ThemeProvider>
    );
};
