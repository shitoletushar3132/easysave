import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { handleFolderCreate, uploadImage } from "../requests/upload";
import { useSetRecoilState } from "recoil";
import { RefreshAtom } from "../store/atomAuth";

const SecondHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFolderCreation, setShowFolderCreation] = useState(true);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  const location = useLocation();
  const setRefresh = useSetRecoilState(RefreshAtom);

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
        uploadImage(file, setStatus, setRefresh);
      }
      // Reset the input
      event.target.value = "";
    }
  };

  const closeDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".dropdown")) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith("/folder/")) {
      setShowFolderCreation(false);
    } else {
      setShowFolderCreation(true);
    }
  }, [location.pathname]);

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
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
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

      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-600 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <form
              onSubmit={(e) =>
                handleFolderCreate(
                  e,
                  setStatus,
                  setShowFolderModal,
                  setFolderName,
                  setRefresh,
                  folderName
                )
              }
            >
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
