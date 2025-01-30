import axios from "axios";
import { toast } from "react-toastify";
import { BASEURL } from "../helper/constant";

const deleteFile = async (fileId: string, key: string) => {
  try {
    const response = await axios.delete(`${BASEURL}/file`, {
      data: { fileId, key },
      withCredentials: true,
    });

    // Notify success
    toast.success(response.data.message || "File deleted successfully");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    toast.error(`Error deleting file: ${errorMessage}`);
  }
};

const deleteFolder = async (folderId: string, folderName: string) => {
  try {
    const response = await axios.delete(`${BASEURL}/folder-name`, {
      data: { folderId, folderName },
      withCredentials: true,
    });

    // Notify success
    toast.success(response.data.message || "Folder deleted successfully");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    toast.error(`Error deleting Folder: ${errorMessage}`);
  }
};

export { deleteFile, deleteFolder };
