import { Layout } from './components/organisms/general/layout';
import { AboutMe } from './sections/about-me';
import { Contact } from './sections/contact';
import { HomePage } from './sections/home';
import { Projects } from './sections/projects';

export const App = () => {
    return (
        <Layout>
            <HomePage />
            <AboutMe />
            <Projects />
            <Contact />
        </Layout>
    );
};
