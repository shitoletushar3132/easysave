import { atom } from "recoil";

// Define the ProfileData interface
interface ProfileData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Define the authState atom with a default value matching ProfileData
export const authState = atom<ProfileData>({
  key: "profile", // unique identifier for this atom
  default: {
    userId: "",
    email: "",
    firstName: "",
    lastName: "",
  }, // default empty profile
});
