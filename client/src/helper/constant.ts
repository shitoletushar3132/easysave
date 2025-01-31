export const BASEURL: string = "https://easysave-main.onrender.com";

export type FolderType = {
  folderId: string;
  name: string;
  path: string;
};

export type FileType = {
  key: string;
  fileId: string;
  name: string;
  url: string;
  date: string;
  type: "image" | "video" | "document" | "audio" | "other";
};
