export const BASEURL: string = "http://localhost:3000";

export type FolderType = {
  id: string;
  name: string;
};

export type FileType = {
  name: string;
  url: string;
  type: "image" | "video" | "document" | "audio" | "other";
};
