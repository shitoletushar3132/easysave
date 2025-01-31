import { toast } from "react-toastify";
import { BASEURL } from "../helper/constant";
import categorizeFileType from "../helper/fileType";

const uploadFiles = async (
  files: File[],
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  setRefresh: React.Dispatch<React.SetStateAction<{ refresh: boolean }>>
): Promise<void> => {
  try {
    const folderName = location.pathname.split("/")[3]; // Get folder from path

    // Step 1: Request pre-signed URLs for all files at once
    const response = await fetch(`${BASEURL}/upload-multiple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        files: files.map((file) => ({
          fileName: file.name,
          fileType: categorizeFileType(file.type),
          fileSize: file.size,
        })),
        folderName,
      }),
    });

    if (!response.ok) throw new Error("Failed to get pre-signed URLs");

    const { uploadedFiles } = await response.json();

    // Step 2: Upload files to the respective pre-signed URLs
    const uploadPromises = uploadedFiles.map(
      async ({ uploadUrl, fileId, fileName }: any) => {
        const file = files.find((f) => f.name === fileName);
        if (!file) throw new Error(`File not found for ${fileName}`);

        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResponse.ok)
          throw new Error(`Upload failed for ${fileName}`);

        // Step 3: Notify backend about the successful upload
        await fetch(`${BASEURL}/file-uploaded`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId, status: "upload" }),
          credentials: "include",
        });

        return fileName;
      }
    );

    // Wait for all uploads to complete
    const uploadedFilesList = await Promise.all(uploadPromises);

    setStatus(`${uploadedFilesList.length} files uploaded successfully!`);
    toast.success("All Files Uploaded Successfully");
    setRefresh((prev) => ({ refresh: !prev.refresh }));
    setStatus("");
  } catch (error) {
    console.error("Error uploading files:", error);
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

export { uploadFiles, handleFolderCreate };
