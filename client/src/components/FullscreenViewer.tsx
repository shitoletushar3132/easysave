import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

const FullscreenViewer: React.FC<any> = ({
  file,
  onClose,
  onPrevious,
  onNext,
  totalFiles,
  currentIndex,
}) => {
  if (!file) return null;

  const renderFile = () => {
    switch (file.type.split("/")[0]) {
      case "image":
        return (
          <img
            src={file.url}
            alt={file.name}
            className="max-h-[85vh] max-w-full object-contain"
          />
        );
      case "video":
        return (
          <video controls className="max-h-[85vh] max-w-full object-contain">
            <source src={file.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "document":
        return (
          <iframe
            src={file.url}
            className="max-h-[85vh] max-w-full "
            title={file.name}
            frameBorder="0"
          />
        );
      default:
        return <div>Preview is not avilable</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black bg-opacity-50">
        <h3 className="text-white text-lg font-medium">{file.name}</h3>
        <div className="flex items-center space-x-4">
          {/* <a
            href={file.url}
            download
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            title="Download"
          >
            <Download className="w-6 h-6 text-white" />
          </a> */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            title="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Navigation Buttons */}
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="absolute left-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* File Preview */}
        <div className="max-h-full max-w-full p-4">{renderFile()}</div>

        <button
          onClick={onNext}
          disabled={currentIndex === totalFiles - 1}
          className="absolute right-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-black bg-opacity-50 text-center text-white">
        {currentIndex + 1} of {totalFiles}
      </div>
    </div>
  );
};

export default FullscreenViewer;
