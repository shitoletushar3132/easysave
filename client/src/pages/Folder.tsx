import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import SecondHeader from "../components/SecondHeader/SecondHeader";
import FullscreenViewer from "../components/FullScreenView/FullscreenViewer";
import { Icon, renderPreview } from "../helper/fileShow";
import { RefreshAtom } from "../store/atomAuth";
import { fetchFolderFiles } from "../requests/fetchFF";
import { FileType } from "../helper/constant";
import FolderPath from "../components/Folder/FolderPath";
import Loader from "../components/Loader";

const Folder = () => {
  const { folderName = "/", folderId = "/" } = useParams();
  const refresh = useRecoilValue(RefreshAtom);

  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = folderName;
    fetchFolderFiles(setFiles, setLoading, folderName);
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

  return (
    <div className="flex flex-col h-screen">
      <SecondHeader />

      <FolderPath folderName={folderName} folderId={folderId} />

      {/* Files Grid */}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-medium text-white mb-4">Files</h2>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto">
            {files.length > 0 ? (
              files.map((file, index) => (
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
              ))
            ) : (
              <p>No File Found</p>
            )}
            {}
          </div>
        )}
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
