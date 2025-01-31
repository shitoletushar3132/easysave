import {
  Download,
  Maximize2,
  Minimize2,
  MoreVerticalIcon,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FileType } from "../../helper/constant";
import { handleDownload } from "../../helper/downloader";

interface HeaderProps {
  file: FileType;
  fileName: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
  onDelete: (fileId: string, key: string) => void;
  onShare: (fileId: string, key: string) => void;
}

const FullScreenViwerHeader: React.FC<HeaderProps> = ({
  file,
  fileName,
  onZoomIn,
  onZoomOut,
  onRotate,
  onToggleFullscreen,
  isFullscreen,
  onClose,
  onDelete,
  onShare,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-black/40">
      <h3 className="text-white text-lg font-medium truncate max-w-[50%]">
        {fileName}
      </h3>
      <div className="flex items-center space-x-2">
        <button
          onClick={onZoomIn}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
          title="Zoom In (Plus Key)"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
          title="Zoom Out (Minus Key)"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={onRotate}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
          title="Rotate (R Key)"
        >
          <RotateCw className="w-5 h-5 text-white" />
        </button>
        <div className="w-px h-6 bg-white/20 mx-2" />
        <button
          onClick={() => handleDownload(file)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
          title="Download"
        >
          <Download className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-white" />
          ) : (
            <Maximize2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* More Options Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button className="p-2" onClick={toggleMenu}>
            <MoreVerticalIcon className="w-5 h-5 text-white" />
          </button>
          {showMoreMenu && (
            <ul className="absolute right-0 mt-2 bg-gray-700 p-2 shadow-md rounded-md z-10">
              <li
                className="px-4 py-2 hover:bg-gray-600 rounded-lg cursor-pointer"
                onClick={() => handleDownload(file)}
              >
                Download
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-600 rounded-lg cursor-pointer"
                onClick={() => onDelete(file.fileId, file.key)}
              >
                Delete
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-600 rounded-lg cursor-pointer"
                onClick={() => onShare(file.fileId, file.key)}
              >
                Share
              </li>
            </ul>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors tooltip"
          title="Close (Esc)"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(FullScreenViwerHeader);
