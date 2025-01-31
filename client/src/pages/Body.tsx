import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast, ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import { authState } from "../store/atomAuth";
import { fetchUserData } from "../requests/auth";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const Body = () => {
  const [profile, setProfile] = useRecoilState(authState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Start with loading true

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await fetchUserData();
      if (!userData?.user?.userId) throw new Error("Invalid user data");
      setProfile(userData.user);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setProfile({ firstName: "", lastName: "", userId: "", email: "" });

      const errorMessage =
        error.response?.data || "Something went wrong. Please try again.";
      toast.error(errorMessage);

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Redirect if not authenticated
  useEffect(() => {
    const currentPath = window.location.pathname; // Get the current route
    if (!loading && !profile.userId && currentPath !== "/signup") {
      navigate("/login");
    }
  }, [profile.userId, loading, navigate]);

  return (
    <div>
      <ToastContainer />
      <NavBar />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Body;
