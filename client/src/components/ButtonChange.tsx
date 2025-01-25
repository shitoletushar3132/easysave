import { Link } from "react-router-dom";

interface ButtonChangeProps {
  text: string;
  navigate: string;
}

const ButtonChange: React.FC<ButtonChangeProps> = ({ text, navigate }) => {
  return (
    <div className="flex gap-3">
      <p>{text}</p>
      <Link
        to={navigate}
        className="text-blue-500 underline hover:text-blue-700 transition duration-300"
      >
        Sigup
      </Link>
    </div>
  );
};

export default ButtonChange;
