import { Download } from "lucide-react";
import { handleDownload } from "../helper/downloader";
import { FileType } from "../helper/constant";

const renderFile = (file: FileType, zoom: number, rotation: number) => {
  const commonStyles = `
      max-h-[85vh] max-w-full object-contain
      transform
      scale-[${zoom}]
      rotate-[${rotation}deg]
      transition-transform duration-200
    `;

  switch (file.type) {
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
          <p className="text-center text-xs">Download For More Enhance View</p>
        </div>
      );
    default:
      return (
        <div className="flex flex-col items-center space-y-4 text-white">
          <p className="text-xl">Preview is not available</p>
          <button
            onClick={() => handleDownload(file)}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download File</span>
          </button>
        </div>
      );
  }
};

export default renderFile;
