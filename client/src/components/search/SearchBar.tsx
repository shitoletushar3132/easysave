import { useState, useRef, useEffect } from "react";
import search from "../../requests/search";
import { FileIcon, FolderIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atomAuth";
import { FileType } from "../../helper/constant";
import FullscreenViewer from "../FullScreenView/FullscreenViewer";
import formatDate from "../../helper/formatDate";

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profile = useRecoilValue(authState);

  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowResults(true);

    if (value.trim() !== "") {
      setIsLoading(true);
      try {
        const data = await search(value);
        setSearchData(data.dataUser);
      } catch (error) {
        console.error("Search error:", error);
        setSearchData([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchData([]);
    }
  };

  const Path = (key: string) => {
    if (key.split("/")[2] === profile.firstName) {
      return key.split("/").pop();
    }

    return key.split("/").slice(1).join("/"); // Use slice instead of splice, and join with '/'
  };

  const getFileIcon = (type: string) => {
    if (type.includes("folder")) {
      return <FolderIcon className="w-5 h-5 text-gray-400" />;
    }
    return <FileIcon className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div
      ref={searchRef}
      className="relative flex grow items-center max-w-lg w-full"
    >
      <div className="relative w-full">
        <input
          onChange={handleChange}
          onFocus={() => setShowResults(true)}
          type="text"
          value={searchValue}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg pr-10 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-400 text-white"
          placeholder={placeholder}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-5 w-5 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults &&
        (searchData.length > 0 || (searchValue && !isLoading)) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[70vh] overflow-y-auto z-50">
            {searchData.length > 0 ? (
              <div className="py-2">
                {searchData.map((item) => (
                  <div
                    key={item.fileId}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedFile(item);
                      setShowResults(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(item.type)}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                            {formatDate(item.date)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate ">
                          <span>{item.type}</span>{" "}
                          <span className="ml-7">Path: {Path(item.key)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found for "{searchValue}"
              </div>
            )}
          </div>
        )}

      <FullscreenViewer
        //@ts-ignore
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onPrevious={() => {}}
        onNext={() => {}}
        totalFiles={1}
        currentIndex={0}
      />
    </div>
  );
};

export default SearchBar;
