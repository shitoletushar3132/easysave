import { BASEURL } from "../constant";
import { handleDownload } from "../constant/downloader";

const FilePreview = ({
  ownerId,
  fileKey,
}: {
  ownerId: string;
  fileKey: string;
}) => {
  const fileUrl = `${BASEURL}/${ownerId}/${fileKey}`;

  const handlePreviewError = () => {
    alert("Preview is not available for this file.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg my-4 sm:my-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mb-2 sm:mb-4 break-words">
          {fileKey.split("/").pop()?.toString() || "Download"}
        </h2>
        <p className="text-center text-gray-600 text-sm sm:text-base mb-2 sm:mb-4">
          | Public |
        </p>

        <div className="relative w-full my-4 sm:my-6">
          {/* 16:9 aspect ratio wrapper */}
          <div className="relative w-full h-0 pb-[56.25%] sm:pb-[75%] md:pb-[65%] lg:pb-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-2 border-gray-200 shadow-md rounded-lg"
              src={fileUrl}
              title="file-preview"
              onError={handlePreviewError}
            />
          </div>
        </div>

        <div className="flex justify-center mt-4 sm:mt-6">
          <button
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-base sm:text-lg font-semibold rounded-lg shadow-md hover:bg-blue-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() =>
              handleDownload({
                url: fileUrl,
                name: fileKey.split("/").pop()?.toString() || "download",
              })
            }
          >
            Download File
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
