import {
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  MoreVerticalIcon,
} from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";

interface FileViewerProps {
  file: {
    name: string;
    url: string;
    type: string;
  };
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  totalFiles: number;
  currentIndex: number;
}

const FullscreenViewer: React.FC<FileViewerProps> = ({
  file,
  onClose,
  onPrevious,
  onNext,
  totalFiles,
  currentIndex,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [showMoreMenu, setShowMoreMenu] = useState<Record<number, boolean>>({});
  const toggleMenu = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Stop event from bubbling up
    setShowMoreMenu({ [index]: !showMoreMenu[index] }); // Only one menu opens at a time
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

  // Handle keyboard navigation
  useEffect(() => {
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

  // Handle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const renderFile = () => {
    const commonStyles = `
      max-h-[85vh] max-w-full object-contain
      transform
      scale-[${zoom}]
      rotate-[${rotation}deg]
      transition-transform duration-200
    `;

    switch (file.type.split("/")[0]) {
      case "image":
        return (
          <img
            src={file.url}
            alt={file.name}
            className={commonStyles}
            style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
          />
        );
      case "video":
        return (
          <video controls className={commonStyles}>
            <source src={file.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case "audio":
        return (
          <audio controls className="w-full h-12">
            <source src={file.url} type="audio/mpeg" />
            <source src={file.url.replace(".mp3", ".ogg")} type="audio/ogg" />
            Your browser does not support the audio tag.
          </audio>
        );
      case "document":
        return (
          <div>
            <div
              className="w-screen h-screen bg-white rounded-lg overflow-hidden mt-2"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                maxHeight: "85vh",
              }}
            >
              <iframe
                src={`${file.url}#toolbar=0&navpanes=0`}
                className="w-full h-full"
                title={file.name}
              />
            </div>
            <p className="text-center text-xs">
              Download For More Enhance View
            </p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center space-y-4 text-white">
            <p className="text-xl">Preview is not available</p>
            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download File</span>
            </button>
          </div>
        );
    }
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-black/40">
        <h3 className="text-white text-lg font-medium truncate max-w-[50%]">
          {file.name}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3))}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
            title="Zoom In (Plus Key)"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
            title="Zoom Out (Minus Key)"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
            title="Rotate (R Key)"
          >
            <RotateCw className="w-5 h-5 text-white" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
            title="Download"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>
          <button className="menu-container relative" title="More Options">
            <MoreVerticalIcon
              className="text-white"
              onClick={(e) => toggleMenu(e, currentIndex)}
            />
            {showMoreMenu[currentIndex] && (
              <ul className="absolute right-0 mt-2 bg-gray-700 p-2 shadow-md rounded-md z-10">
                <li
                  className="px-4 py-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer"
                  onClick={handleDownload}
                >
                  Download
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 hover:rounded-lg  cursor-pointer">
                  Delete
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 hover:rounded-lg  cursor-pointer">
                  Share
                </li>
              </ul>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
            title="Close (Esc)"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <button
            onClick={onPrevious}
            className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/75 transition-all transform hover:scale-110 group"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-400" />
          </button>
        )}

        {/* File Preview */}
        <div className="max-h-full max-w-full p-4 select-none">
          {renderFile()}
        </div>

        {currentIndex < totalFiles - 1 && (
          <button
            onClick={onNext}
            className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/75 transition-all transform hover:scale-110 group"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-400" />
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gradient-to-t from-black/80 to-black/40">
        <div className="flex justify-between items-center text-white/80">
          <div className="text-sm">
            {currentIndex + 1} of {totalFiles}
          </div>
          <div className="text-sm space-x-4">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>Rotation: {rotation}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenViewer;
