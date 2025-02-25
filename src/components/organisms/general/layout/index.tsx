import { NavBar } from "../../../molecules/general/navbar";
import { HamburgerMenu } from "../../../molecules/general/hamburger-menu";

export function Layout() {
  return (
    <>
    <div className="md:block">
      <NavBar />
    </div>
    <div className="block md:hidden">
      <HamburgerMenu/>
    </div>
      </>
  );
}
