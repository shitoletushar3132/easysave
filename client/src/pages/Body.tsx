import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast, ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import { authState } from "../store/atomAuth";
import { fetchUserData } from "../requests/auth";
import { useEffect } from "react";

const Body = () => {
  const [profile, setProfile] = useRecoilState(authState);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const userData = await fetchUserData();
      setProfile(userData.user);
    } catch (error: any) {
      toast.error(error.response.data);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!profile.userId) {
      fetchData();
    }
  }, [setProfile]);

  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Body;
