import { useState, useEffect, useRef } from "react";

interface FileUploadDropdownProps {
  onNewFileClick: () => void;
  onNewFolderClick: () => void;
  showFolderCreation: boolean;
  status: string;
}

const FileUploadDropdown: React.FC<FileUploadDropdownProps> = ({
  onNewFileClick,
  onNewFolderClick,
  showFolderCreation,
  status,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative dropdown">
      <div className="flex flex-col items-center  space-y-2">
        <button
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Upload
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-base-300 shadow-lg z-50 border border-gray-700">
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  onNewFileClick();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-600"
              >
                New File
              </button>
            </li>
            {showFolderCreation && (
              <li>
                <button
                  onClick={() => {
                    onNewFolderClick();
                    setIsDropdownOpen(false);
                  }}
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
  );
};

export default FileUploadDropdown;
