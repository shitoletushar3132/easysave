import { MAINURL } from "../constant";
import logo from "../assets/easySaveLogo.webp";
const Header = () => {
  return (
    <div className="p-4 bg-gray-900 flex justify-between items-center">
      <a
        href={MAINURL}
        className="text-xl font-semibold tracking-wide bg-gradient-to-r from-sky-600 via-white to-red-700 text-transparent bg-clip-text flex justify-center items-center gap-2"
      >
        <div className="w-10 rounded-full ">
          <img src={logo} className="rounded-full" />
        </div>
        EasySave
      </a>

      <a href={MAINURL}>
        <button className="px-6 py-2 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-400 transition duration-300">
          Login
        </button>
      </a>
    </div>
  );
};

export default Header;
