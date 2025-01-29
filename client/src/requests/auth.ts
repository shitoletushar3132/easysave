import axios from "axios";
import { BASEURL } from "../helper/constant";
import { LoginData, InputBoxSignUp } from "../types";

const login = async ({ emailId, password }: LoginData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/login`,
      {
        email: emailId,
        password,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

const signup = async ({
  firstName,
  lastName,
  emailId,
  password,
}: InputBoxSignUp) => {
  try {
    const response = await axios.post(
      `${BASEURL}/signup`,
      {
        firstName,
        lastName,
        email: emailId,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

const fetchUserData = async () => {
  try {
    const user = await axios.get(`${BASEURL}/profile`, {
      withCredentials: true,
    });

    return await user.data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await axios.get(`${BASEURL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
const uploadFile = async () => {};

const createFolder = async () => {};

export { login, signup, uploadFile, createFolder, fetchUserData, logout };
