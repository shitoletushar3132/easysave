import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../store/atomAuth";
import { logout } from "../requests/auth";
import { toast } from "react-toastify";
import logo from "../assets/easySaveLogo.webp"; // Adjust the filename accordingly
import { useEffect } from "react";
import { shareFile } from "../requests/public";

const NavBar = () => {
  const [profile, setProfile] = useRecoilState(authState);
  const navigate = useNavigate();
  const handleLogOut = async () => {
    const response = await logout();
    setProfile({ email: "", firstName: "", lastName: "", userId: "" });
    navigate("/login");
    toast.success(response.message);
  };

  const handleShare = async () => {
    await shareFile();
  };

  useEffect(() => {
   handleShare()
  }, []);

  return (
    <div className="navbar bg-base-300 shadow-lg">
      <div className="flex-1 flex items-center space-x-2">
        <NavLink to={"/"} className="btn btn-ghost flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-wide bg-gradient-to-r from-sky-400 via-white to-red-500 text-transparent bg-clip-text">
            EasySave
          </span>
        </NavLink>
      </div>

      <div className="flex-none">
        {profile.userId && (
          <h1 className="text-sm">
            <span>Welcome,</span>{" "}
            <span className="font-bold">{profile.firstName.toUpperCase()}</span>
          </h1>
        )}

        <div className="dropdown dropdown-end mr-4">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src={logo} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a onClick={() => handleLogOut()}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
