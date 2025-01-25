import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

export const Body = () => {
  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};
