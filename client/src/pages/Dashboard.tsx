import { useNavigate } from "react-router-dom";
import { Folder } from "lucide-react";
import SecondHeader from "../components/SecondHeader/SecondHeader";
import { useState, useEffect } from "react";
import FullscreenViewer from "../components/FullScreenView/FullscreenViewer";
import { useRecoilValue } from "recoil";
import { RefreshAtom } from "../store/atomAuth";
import { fetchFiles, fetchFolders } from "../requests/fetchFF";
import { FileType, FolderType } from "../helper/constant";
import { colors, Icon, renderPreview } from "../helper/fileShow";
import Loader from "../components/Loader";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [files, setFiles] = useState<FileType[]>([]);
  const refresh = useRecoilValue(RefreshAtom);

  useEffect(() => {
    fetchFolders(setFolders, setLoading);
    fetchFiles(setFiles, setLoading);
  }, [refresh]);

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const handleFolderClick = (folderName: string, folderId: string) => {
    navigate(`/folder/${folderId}/${folderName}`);
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

  return (
    <div className="flex flex-col h-screen ">
      <SecondHeader />

      <div className="p-6">
        <h2 className="text-lg font-medium text-white mb-4">Folders</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.length > 0 && !loading ? (
              folders.map((folder) => (
                <div
                  key={folder.folderId}
                  onClick={() =>
                    handleFolderClick(folder.name, folder.folderId)
                  }
                  className="group cursor-pointer relative"
                >
                  <div className="flex flex-col items-center p-4 rounded-lg bg-base-300 border border-base-200 hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 ease-in-out">
                    <div className="mb-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <Folder
                        size={40}
                        color={colors.folder}
                        fill={colors.folder}
                      />
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-blue-400">
                      {folder.name}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-200" />
                </div>
              ))
            ) : (
              <p>No Folder Found</p>
            )}
          </div>
        )}
      </div>

      {/* Files Section */}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-medium text-white mb-4">Files</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto">
            {files.length > 0 && !loading ? (
              files.map((file, index) => (
                <div
                  key={index}
                  onClick={() => handleFileClick(file, index)}
                  className="group relative cursor-pointer m-1"
                >
                  <div className="flex flex-col rounded-lg bg-base-300 border border-base-200 overflow-hidden hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 ease-in-out ">
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                      {renderPreview(file)}{" "}
                      {/* Conditional rendering of preview */}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center space-x-2 ">
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
          </div>
        )}
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
