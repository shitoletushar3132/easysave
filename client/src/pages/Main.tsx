import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Main = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <Outlet />
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Main;
