import { BASEURL } from "../helper/constant";
import { fetchData } from "../pages/Body";

const fetchFolders = async (
  setFolders: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const response = await fetch(`${BASEURL}/folder-name`, {
      credentials: "include",
    });
    const data = await response.json();

    setFolders(data);
    setLoading(false);
  } catch (error) {
    fetchData();
    console.error("Error fetching folder files:", error);
    setLoading(false);
  }
};

const fetchFiles = async (
  setFiles: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const response = await fetch(`${BASEURL}/file-lists`, {
      credentials: "include",
    });
    const data = await response.json();
    setFiles(data);
    setLoading(false);
  } catch (error) {
    fetchData();
    console.error("Error fetching folder files:", error);
    setLoading(false);
  }
};

const fetchFolderFiles = async (
  setFiles: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  folderName: string
) => {
  try {
    setLoading(true);
    const response = await fetch(`${BASEURL}/folder-content/${folderName}`, {
      credentials: "include",
    });
    const data = await response.json();
    setFiles(data);
    setLoading(false);
  } catch (error) {
    fetchData();
    console.error("Error fetching folder files:", error);
    setLoading(false);
  }
};

export { fetchFolders, fetchFiles, fetchFolderFiles };
