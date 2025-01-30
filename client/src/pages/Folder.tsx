import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { MoreVerticalIcon } from "lucide-react";
import SecondHeader from "./SecondHeader";
import FullscreenViewer from "../components/FullscreenViewer";
import { Icon, renderPreview } from "../helper/fileShow";
import { RefreshAtom } from "../store/atomAuth";
import { fetchFolderFiles } from "../requests/fetchFF";

const Folder = () => {
  const { folderName = "/" } = useParams();
  const refresh = useRecoilValue(RefreshAtom);

  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<{
    id: number;
    name: string;
    url: string;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showMoreMenu, setShowMoreMenu] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchFolderFiles(setFiles, folderName);
  }, [folderName, refresh]);

  const handleFileClick = (file: any, index: number) => {
    setSelectedFile(file);
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedFile(files[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedFile(files[currentIndex + 1]);
    }
  };

  const toggleMenu = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setShowMoreMenu((prev) => ({ [index]: !prev[index] }));
  };

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".menu-container")) {
        setShowMoreMenu({});
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <SecondHeader />

      {/* Folder Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">
          <Link to="/" className="text-red-300 cursor-pointer">
            Home
          </Link>
          <span> / {folderName}</span>
        </h1>
        <button className="menu-container relative" title="More Options">
          <MoreVerticalIcon
            className="text-white"
            onClick={(e) => toggleMenu(e, currentIndex)}
          />
          {showMoreMenu[currentIndex] && (
            <ul className="absolute right-0 mt-2 bg-gray-700 p-2 shadow-md rounded-md z-10">
              <li className="px-4 py-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">
                Delete
              </li>
              <li className="px-4 py-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">
                Share
              </li>
            </ul>
          )}
        </button>
      </div>

      {/* Files Grid */}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-medium text-white mb-4">Files</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={index}
              className="group relative cursor-pointer m-1"
              onClick={() => handleFileClick(file, index)}
            >
              <div className="flex flex-col rounded-lg bg-base-300 border border-base-200 overflow-hidden hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 ease-in-out">
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  {renderPreview(file)}
                </div>
                <div className="p-3">
                  <div className="flex items-center space-x-2">
                    <Icon type={file.type} />
                    <span className="text-sm font-medium text-white truncate">
                      {file.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Viewer */}
      <FullscreenViewer
        //@ts-expect-error
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        totalFiles={files.length}
        currentIndex={currentIndex}
      />
    </div>
  );
};

export default Folder;
