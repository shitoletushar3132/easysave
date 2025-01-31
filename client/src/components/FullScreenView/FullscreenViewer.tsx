import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import { deleteFile } from "../../requests/delete";
import { FileType } from "../../helper/constant";
import { useSetRecoilState } from "recoil";
import { RefreshAtom } from "../../store/atomAuth";
import renderFile from "../renderFile";
import FullScreenViewerFooter from "./FullScreenViewerFooter";
import FullScreenViewerNavigator from "./FullScreenViewerNavigator";
import FullScreenViwerHeader from "./FullScreenViwerHeader";
import ShareMessage from "../ShareMessage";
import { shareFile } from "../../requests/public";

interface FileViewerProps {
  file: FileType;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  totalFiles1: number;
  currentIndex: number;
}

const FullscreenViewer: React.FC<FileViewerProps> = ({
  file,
  onClose,
  onPrevious,
  onNext,
  totalFiles1,
  currentIndex,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareMessage, setShowShareMessage] = useState(false);
  const setRefresh = useSetRecoilState(RefreshAtom);

  const memoizedFile = useMemo(() => file, [file]);
  const totalFiles = useMemo(() => totalFiles1, [totalFiles1]);
  const [link, setLink] = useState("");

  const handleZoomIn = useCallback(
    () => setZoom((prev) => Math.min(prev + 0.25, 3)),
    []
  );
  const handleZoomOut = useCallback(
    () => setZoom((prev) => Math.max(prev - 0.25, 0.5)),
    []
  );
  const handleRotate = useCallback(
    () => setRotation((prev) => (prev + 90) % 360),
    []
  );

  useEffect(() => {
    if (file) {
      document.title = file.name;
    }
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (currentIndex > 0) onPrevious();
          break;
        case "ArrowRight":
          if (currentIndex < totalFiles - 1) onNext();
          break;
        case "Escape":
          onClose();
          break;
        case "+":
          setZoom((prev) => Math.min(prev + 0.25, 3));
          break;
        case "_":
          setZoom((prev) => Math.max(prev - 0.25, 0.5));
          break;
        case "r":
          setRotation((prev) => (prev + 90) % 360);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, totalFiles, onPrevious, onNext, onClose]);

  const toggleFullscreen = useCallback(async () => {
    setIsFullscreen((prev) => !prev);
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const handleDelete = useCallback(
    async (fileId: string, key: string) => {
      const res = await deleteFile(fileId, key);
      if (res.success) {
        onClose();
        setRefresh((prev) => ({ refresh: !prev.refresh }));
      }
    },
    [onClose, setRefresh]
  );

  const handleShare = useCallback(async (fileId: string, key: string) => {
    setShowShareMessage(true);
    const resp = await shareFile(fileId, key);
    setLink(resp.shareLink);
  }, []);

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <FullScreenViwerHeader
        file={memoizedFile}
        fileName={memoizedFile.name}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onClose={onClose}
        onDelete={handleDelete}
        onShare={handleShare}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative">
        <FullScreenViewerNavigator
          onPrevious={onPrevious}
          onNext={onNext}
          currentIndex={currentIndex}
          totalFiles={totalFiles}
        />
        <div className="max-h-full max-w-full p-4 select-none">
          {renderFile(memoizedFile, zoom, rotation)}
        </div>
      </div>

      {/* Footer */}
      <FullScreenViewerFooter
        currentIndex={currentIndex}
        totalFiles={totalFiles}
        zoom={zoom}
        rotation={rotation}
      />

      {showShareMessage && (
        <ShareMessage
          link={link}
          onShowMessage={showShareMessage}
          setOnShowMessage={setShowShareMessage}
        />
      )}
    </div>
  );
};

export default memo(FullscreenViewer);
