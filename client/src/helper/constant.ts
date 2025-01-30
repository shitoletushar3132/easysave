export const BASEURL: string = "http://localhost:3000";

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
  type: "image" | "video" | "document" | "audio" | "other";
};
