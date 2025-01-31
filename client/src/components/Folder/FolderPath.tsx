import { MoreVerticalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteFolder } from "../../requests/delete";

interface FolderPathProps {
  folderName: string;
  folderId: string;
}

const FolderPath: React.FC<FolderPathProps> = ({ folderName, folderId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const Navigate = useNavigate();

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    const response = await deleteFolder(folderId, folderName);
    if (response.success) {
      Navigate("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 flex justify-between items-center">
      {/* Folder Path */}
      <h1 className="font-bold text-xl">
        <Link to="/" className="text-red-300 cursor-pointer">
          Home
        </Link>
        <span> / {folderName}</span>
      </h1>

      {/* More Options Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          title="More Options"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <MoreVerticalIcon className="text-white" />
        </button>

        {isDropdownOpen && (
          <ul className="absolute right-0 mt-2 bg-gray-700 p-2 shadow-md rounded-md z-10">
            <li
              className="px-4 py-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer"
              onClick={() => handleDeleteFolder(folderId, folderName)}
            >
              Delete
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default FolderPath;
