const categorizeFileType = (fileType: string): string => {
  console.log(fileType);
  const imageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  console.log(fileType);
  const audioTypes = ["audio/mp3", "audio/wav", "audio/ogg", "audio/mpeg"];
  const videoTypes = ["video/mp4", "video/webm", "video/ogg"];
  const documentTypes = ["application/pdf"];

  if (imageTypes.includes(fileType)) {
    return "image";
  } else if (audioTypes.includes(fileType)) {
    return "audio";
  } else if (videoTypes.includes(fileType)) {
    return "video";
  } else if (documentTypes.includes(fileType)) {
    return "document";
  } else {
    return "other";
  }
};

export default categorizeFileType;
