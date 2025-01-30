import { BASEURL } from "../helper/constant";

const fetchFolders = async (
  setFolders: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const response = await fetch(`${BASEURL}/folder-name`, {
    credentials: "include",
  });
  const data = await response.json();

  setFolders(data);
};

const fetchFiles = async (
  setFiles: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const response = await fetch(`${BASEURL}/file-lists`, {
    credentials: "include",
  });
  const data = await response.json();
  setFiles(data);
};

const fetchFolderFiles = async (
  setFiles: React.Dispatch<React.SetStateAction<any[]>>,
  folderName: string
) => {
  try {
    const response = await fetch(`${BASEURL}/folder-content/${folderName}`, {
      credentials: "include",
    });
    const data = await response.json();
    setFiles(data);
  } catch (error) {
    console.error("Error fetching folder files:", error);
  }
};

export { fetchFolders, fetchFiles, fetchFolderFiles };
