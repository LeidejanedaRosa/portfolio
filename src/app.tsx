import { Layout } from "./components/organisms/general/layout";
import { HomePage } from "./sections/home";

export const App = () => {
  return (
    <div className="App">
      <Layout/>
      <HomePage/>
    </div>
  );
}

