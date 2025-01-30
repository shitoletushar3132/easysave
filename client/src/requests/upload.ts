import { toast } from "react-toastify";
import { BASEURL } from "../helper/constant";
import categorizeFileType from "../helper/fileType";

const uploadImage = async (
  file: File,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  setRefresh: React.Dispatch<React.SetStateAction<{ refresh: boolean }>>
): Promise<void> => {
  try {
    const response = await fetch(`${BASEURL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        fileName: file.name,
        fileType: categorizeFileType(file.type),
        fileSize: file.size,
        folderName: location.pathname.split("/")[2],
      }),
    });

    if (!response.ok) {
      setStatus("Failed to Upload Try again");
      toast("Failed to Upload Try again");
      return;
    }

    const { url, fileId }: { url: string; fileId: string } =
      await response.json();

    const uploadResponse = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (uploadResponse.ok) {
      const notifyResponse = await fetch(`${BASEURL}/file-uploaded`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          status: "upload",
        }),
        credentials: "include",
      });

      if (notifyResponse.ok) {
        setStatus("File uploaded successfully!");
        toast.success("File Upload Successfully");
        setRefresh((prev) => ({ refresh: !prev.refresh }));
        setStatus("");
      } else {
        throw new Error("Try Again");
      }
    } else {
      await fetch("/file-uploaded", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          status: "error",
        }),
      });
      setStatus("Upload failed.");
      toast.info("Fail to Upload File Try Again");
      setStatus("");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    setStatus("An error occurred during upload.");
    toast.error("An error occurred during upload.");
  }
};

const handleFolderCreate = async (
  e: React.FormEvent,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  setShowFolderModal: React.Dispatch<React.SetStateAction<boolean>>,
  setFolderName: React.Dispatch<React.SetStateAction<string>>,
  setRefresh: React.Dispatch<React.SetStateAction<{ refresh: boolean }>>,
  folderName: string
) => {
  e.preventDefault();
  setShowFolderModal(false);
  if (folderName === "") {
    toast.warn("Enter a Vaild Name");
  }
  if (folderName.trim()) {
    // Handle the folder creation here
    try {
      const response = await fetch(`${BASEURL}/create-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderName,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        setStatus("Failed to Upload Try again");
        toast("Failed to Upload Try again");
        return;
      }

      setStatus("Folder Created successfully!");
      toast.success("Folder Created successfully!");
      setRefresh((prev) => ({ refresh: !prev.refresh }));
      setStatus("");
    } catch (error) {
      console.error("Error uploading image:", error);
      setStatus("An error occurred during Folder creation.");
      toast.error("An error occurred during Folder creation.");
      setStatus("");
    }
    setFolderName("");
    setShowFolderModal(false);
  }
};

export { uploadImage, handleFolderCreate };
