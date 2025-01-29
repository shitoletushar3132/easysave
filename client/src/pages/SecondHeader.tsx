import { useState, useEffect, useRef } from "react";
import { BASEURL } from "../helper/constant";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const SecondHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFolderCreation, setShowFolderCreation] = useState(true);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/folder/")) {
      setShowFolderCreation(false);
    } else {
      setShowFolderCreation(true);
    }
  }, [location.pathname]);

  // Define a function to categorize file types based on extension or MIME type
  const categorizeFileType = (fileType: string): string => {
    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    const audioTypes = ["audio/mp3", "audio/wav", "audio/ogg"];
    const videoTypes = ["video/mp4", "video/webm", "video/ogg"];
    const documentTypes = ["application/pdf"];

    // Check and categorize based on MIME type
    if (imageTypes.includes(fileType)) {
      return "image";
    } else if (audioTypes.includes(fileType)) {
      return "audio";
    } else if (videoTypes.includes(fileType)) {
      return "video";
    } else if (documentTypes.includes(fileType)) {
      return "document";
    } else {
      return "other"; // Fallback for unknown types
    }
  };

  const uploadImage = async (file: File): Promise<void> => {
    try {
      // Step 1: Get the pre-signed URL from the server
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
          "Content-Type": file.type, // Set the file type
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
          setStatus("");
        } else {
          throw new Error("Try Again");
        }

        // console.log(uploadResponse);
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

  const handleActionClick = (type: string) => {
    setIsDropdownOpen(false);
    if (type === "newFile") {
      fileInputRef.current?.click();
    } else if (type === "newFolder") {
      setShowFolderModal(true);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle the file upload here
      if (file) {
        setStatus("Uploading...Do Not Referesh");
        uploadImage(file);
      }
      // Reset the input
      event.target.value = "";
    }
  };

  const handleFolderCreate = async (e: React.FormEvent) => {
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

  const closeDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".dropdown")) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="p-4 shadow-sm rounded-lg ">
      <div className="flex justify-between items-center gap-4">
        {/* Search Bar */}
        <div className="flex grow items-center max-w-lg w-full">
          <label className="relative w-full">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="absolute top-1/2 right-3 h-5 w-5 transform -translate-y-1/2 text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Custom File Upload */}
        <div className="relative dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center space-y-2">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Upload
            </button>
            <div className="text-sm text-gray-600 truncate max-w-xs">
              {status}
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-base-300 shadow-lg z-50 border border-gray-700">
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => handleActionClick("newFile")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-600"
                  >
                    New File
                  </button>
                </li>
                {showFolderCreation && (
                  <li>
                    <button
                      onClick={() => handleActionClick("newFolder")}
                      className="w-full px-4 py-2 text-left hover:bg-gray-600"
                    >
                      Create New Folder
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Folder Creation Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-600 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <form onSubmit={handleFolderCreate}>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFolderModal(false);
                    setFolderName("");
                  }}
                  className="px-4 py-2 text-white hover:bg-gray-100  hover:text-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondHeader;
