import { useEffect, useRef, useState } from "react";
import FileUploadDropdown from "./FileUploadDropDown";
import FolderCreationModal from "./FolderCreationModal";
import SearchBar from "./SearchBar";
import { handleFolderCreate, uploadFiles } from "../../requests/upload";
import { useSetRecoilState } from "recoil";
import { RefreshAtom } from "../../store/atomAuth";
import { useLocation } from "react-router-dom";

const SecondHeader = () => {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFolderCreation, setShowFolderCreation] = useState(true);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  const location = useLocation();
  const setRefresh = useSetRecoilState(RefreshAtom);

  const handleActionClick = (type: string) => {
    if (type === "newFile") {
      fileInputRef.current?.click();
    } else if (type === "newFolder") {
      setShowFolderModal(true);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setStatus(`Uploading ${files.length} files... Do Not Refresh`);

      // Convert FileList to an array and pass it directly
      const filesArray = Array.from(files);
      uploadFiles(filesArray, setStatus, setRefresh);

      event.target.value = ""; // Reset input after upload
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith("/folder/")) {
      setShowFolderCreation(false);
    } else {
      setShowFolderCreation(true);
    }
  }, [location.pathname]);

  return (
    <div className="p-4 shadow-sm rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <SearchBar placeholder="Search..." />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileChange}
        />

        <FileUploadDropdown
          onNewFileClick={() => handleActionClick("newFile")}
          onNewFolderClick={() => handleActionClick("newFolder")}
          showFolderCreation={showFolderCreation}
          status={status}
        />
      </div>

      <FolderCreationModal
        showFolderModal={showFolderModal}
        folderName={folderName}
        onFolderNameChange={(e) => setFolderName(e.target.value)}
        onCancel={() => {
          setShowFolderModal(false);
          setFolderName("");
        }}
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
      />
    </div>
  );
};

export default SecondHeader;
