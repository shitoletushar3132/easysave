import axios from "axios";
import { BASEURL } from "../helper/constant";
import { toast } from "react-toastify";

const shareFile = async (fileId: string, key: string) => {
  try {
    const response = await axios.post(
      `${BASEURL}/share/file`,
      {
        fileId,
        key,
      },
      { withCredentials: true }
    );

    toast.info(response?.data?.message);
    return response.data;
  } catch (error: any) {
    console.error("Error sharing file:", error.response?.data || error.message);
  }
};

const sharedFiles = async () => {
  try {
    const response = await axios.get(`${BASEURL}/share/files`, {
      withCredentials: true,
    });

    toast.info(response?.data?.message);
    return response.data;
  } catch (error: any) {
    console.error("Error sharing file:", error.response?.data || error.message);
  }
};

const updateAccessiblity = async (
  fileId: string,
  key: string,
  setRefresh: React.Dispatch<React.SetStateAction<{ refresh: boolean }>>
) => {
  try {
    const response = await axios.patch(
      `${BASEURL}/share/file`,
      {
        fileId,
        key,
      },
      { withCredentials: true }
    );

    toast.info(response?.data?.message);
    setRefresh((prev) => ({ refresh: !prev.refresh }));
    return response.data;
  } catch (error: any) {
    console.error("Error sharing file:", error.response?.data || error.message);
  }
};

export { shareFile, sharedFiles, updateAccessiblity };
