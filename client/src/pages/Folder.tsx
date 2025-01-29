import { Link, useParams } from "react-router-dom";
import SecondHeader from "./SecondHeader";
import { FileImage } from "lucide-react";
import FullscreenViewer from "../components/FullscreenViewer";
import { useState } from "react";

const Folder = () => {
  const files = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    name: `Image ${index + 1}`,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9SRRmhH4X5N2e4QalcoxVbzYsD44C-sQv-w&s",
    type: "image/jpg",
  }));

  const [selectedFile, setSelectedFile] = useState<{
    id: number;
    name: string;
    url: string;
  } | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

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

  const { folderName } = useParams();

  return (
    <div className="flex flex-col h-screen">
      <SecondHeader />
      <div className="p-4">
        <h1 className="font-bold text-xl">
          <Link to={"/"} className="text-red-300">
            {" "}
            Home{" "}
          </Link>
          <span>/ </span>
          {folderName}
        </h1>
      </div>
      <div className="flex-1 p-4">
        <h2 className="text-lg font-medium text-white mb-4">Files</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="group relative cursor-pointer m-1"
              onClick={() => handleFileClick(file, index)}
            >
              <div className="flex flex-col rounded-lg bg-base-300 border border-base-200 overflow-hidden hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 ease-in-out ">
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
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
      <FullscreenViewer
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
