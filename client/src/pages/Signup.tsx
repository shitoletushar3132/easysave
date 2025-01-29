import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputBoxSignUp } from "../types";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Button from "../components/Button";
import ButtonChange from "../components/ButtonChange";
import { signup } from "../requests/auth";
import { useSetRecoilState } from "recoil";
import { authState } from "../store/atomAuth";

const Signup = () => {
  const Navigate = useNavigate();
  const setProfile = useSetRecoilState(authState);
  const [formData, setFormData] = useState<InputBoxSignUp>({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await signup(formData); // Pass the entire formData object
      setProfile(response.user);
      Navigate("/");
      toast.success(response);
    } catch (error: any) {
      toast.error(error.response?.data || "Login failed!"); // Show error message
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 p-8 shadow-lg rounded-xl bg-base-300">
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-500 mb-4">
          Sign Up To DEV MATCH
        </h2>

        <Input
          label="First Name"
          placeholder="Enter your First Name"
          onChange={handleInputChange}
          name="firstName"
        />
        <Input
          label="Last Name"
          placeholder="Enter your Last Name"
          onChange={handleInputChange}
          name="lastName"
        />

        <Input
          label="Email"
          placeholder="Enter your Email"
          onChange={handleInputChange}
          name="emailId"
        />

        <Input
          label="Password"
          placeholder="Enter your Password"
          onChange={handleInputChange}
          name="password"
        />

        <Button
          label="Signup"
          onClick={handleLogin}
          // className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        />

        <ButtonChange text="Already have an Account ? " navigate="/login" />
      </div>
    </div>
  );
};

export default Signup;
