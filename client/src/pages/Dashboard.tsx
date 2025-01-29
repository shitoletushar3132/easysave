import { useNavigate } from "react-router-dom";
import { Folder, FileImage, FileVideo, FileText } from "lucide-react"; // Added FileVideo for video file
import SecondHeader from "./SecondHeader";
import { useState, useEffect } from "react";
import FullscreenViewer from "../components/FullscreenViewer";
import { BASEURL } from "../helper/constant";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    url: string;
    type: string;
  } | null>(null);

  const [folders, setFolders] = useState<any[]>([]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    // Fetching files from API
    const fetchFolders = async () => {
      const response = await fetch(`${BASEURL}/folder-name`, {
        credentials: "include",
      });
      const data = await response.json();
      setFolders(data);
    };

    const fetchFiles2 = async () => {
      const response = await fetch(`${BASEURL}/content1`, {
        credentials: "include",
      });
      const data = await response.json();
      setFiles(data);
    };

    fetchFolders();
    fetchFiles2();
  }, []);

  const handleFolderClick = (folderName: string) => {
    navigate(`/folder/${folderName}`);
  };

  const handleFileClick = (file: (typeof files)[0], index: number) => {
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

  // Function to render file previews based on the file type
  const renderPreview = (file: any) => {
    switch (file.type.split("/")[0]) {
      case "image":
        return (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        );
      case "video":
        return (
          <video controls className="w-full h-full">
            <source src={file.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "application":
        return (
          <div className="w-full h-full flex justify-center items-center">
            <FileText size={40} className="text-gray-400" />
            <span className="text-gray-500">PDF Preview</span>
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex justify-center items-center">
            <FileImage size={40} className="text-gray-400" />
            <span className="text-gray-500">File Preview</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <SecondHeader />

      {/* Folders Section */}
      <div className="p-6">
        <h2 className="text-lg font-medium text-white mb-4">Folders</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder.name)}
              className="group cursor-pointer relative"
            >
              <div className="flex flex-col items-center p-4 rounded-lg bg-base-300 border border-base-200 hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 ease-in-out">
                <div className="mb-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                  <Folder size={40} />
                </div>
                <span className="text-sm font-medium text-white group-hover:text-blue-400">
                  {folder.name}
                </span>
              </div>
              <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-medium text-white mb-4">Files</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={index}
              className="group relative cursor-pointer m-1"
              onClick={() => handleFileClick(file, index)}
            >
              <div className="flex flex-col rounded-lg bg-base-300 border border-base-200 overflow-hidden hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 ease-in-out ">
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  {renderPreview(file)} {/* Conditional rendering of preview */}
                </div>
                <div className="p-3">
                  <div className="flex items-center space-x-2">
                    <FileImage size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 truncate">
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
        //@ts-ignore
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

export default Dashboard;
