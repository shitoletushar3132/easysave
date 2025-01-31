import {
  File,
  FileImage,
  FileMusic,
  FileText,
  FileVideo,
  ImageIcon,
  Music,
  Play,
  Video,
} from "lucide-react";

const renderPreview = (file: { name: string; url: string; type: string }) => {
  const fileType = file.type.split("/")[0];

  switch (fileType) {
    case "image":
      return (
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      );

    case "video":
      return (
        <div className="w-full h-full flex justify-center items-center">
          <Play color="black" size={30} />
        </div>
      );

    case "audio":
      return (
        <audio controls className="w-full h-full">
          <source src={file.url} type={file.type} />
          Your browser does not support the audio tag.
        </audio>
      );

    case "application":
    case "document":
      return (
        <iframe
          src={file.url}
          className="h-full w-full overflow-hidden"
          title={file.name}
        />
      );

    default:
      return (
        <div className="w-full h-full flex flex-col justify-center items-center text-gray-500">
          {fileType === "audio" ? (
            <FileMusic size={40} className="text-gray-400" />
          ) : fileType === "video" ? (
            <FileVideo size={40} className="text-gray-400" />
          ) : fileType === "document" || fileType === "application" ? (
            <FileText size={40} className="text-gray-400" />
          ) : fileType === "image" ? (
            <FileImage size={40} className="text-gray-400" />
          ) : (
            <FileText size={20} className="text-gray-400" />
          )}
          <span>File Preview Not Available</span>
        </div>
      );
  }
};

const colors = {
  image: "#4CAF50", // Green
  audio: "#FF9800", // Orange
  video: "#E91E63", // Pink
  folder: "#FFC107", // Yellow
  file: "#2196F3", // Blue
};

const Icon = ({ type }: { type: string }) => {
  switch (type) {
    case "image":
      return <ImageIcon className="min-w-5 h-5" color={colors.image} />;
    case "video":
      return <Video className="min-w-5 h-5" color={colors.video} />;
    case "document":
      return <File className="min-w-5 h-5" color={colors.file} />;
    case "audio":
      return <Music className="min-w-5 h-5" color={colors.image} />;
    case "file":
    default:
      return <FileText className="min-w-5 h-5" color={colors.file} />;
  }
};

export { renderPreview, Icon, colors };
