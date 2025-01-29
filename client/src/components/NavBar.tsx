import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../store/atomAuth";
import { logout } from "../requests/auth";
import { toast } from "react-toastify";

const NavBar = () => {
  const [profile, setProfile] = useRecoilState(authState);
  const navigate = useNavigate();
  const handleLogOut = async () => {
    const response = await logout();
    setProfile({ email: "", firstName: "", lastName: "", userId: "" });
    navigate("/login");
    toast.success(response.message);
  };
  return (
    <div className="navbar bg-base-300 shadow-lg">
      <div className="flex-1">
        <NavLink to={"/"} className="btn btn-ghost text-xl">
          🧑‍💻 DEV MATCH
        </NavLink>
      </div>
      <div className="flex-none gap-2">
        {profile.userId && <h1> Welcome, {profile.firstName}</h1>}

        <div className="dropdown dropdown-end mx-5">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
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
