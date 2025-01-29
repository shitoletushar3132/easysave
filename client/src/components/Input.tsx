import { InputBox } from "../types";

const Input: React.FC<InputBox> = ({
  label,
  placeholder,
  onChange,
  name,
  type = "text",
}) => {
  return (
    <label className="w-full">
      <div className="mb-2">
        <span className="block text-sm font-medium text-gray-500">{label}</span>
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full p-3 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={onChange}
      />
    </label>
  );
};

export default Input;
