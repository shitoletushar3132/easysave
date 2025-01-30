import express from "express";
import Prisma from "../PrismaInit";
import { userAuth } from "../middleware/auth";
import { BASEURL } from "../constant";

const folderRoute = express.Router();
folderRoute.get("/folder-content/:folderName", userAuth, async (req, res) => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const { folderName } = req.params;

    const folder = await Prisma.folder.findFirst({
      where: { name: folderName, ownerId: userId },
    });

    if (!folder) {
      res
        .status(404)
        .json({ error: "Folder not found or unauthorized access" });
      return;
    }

    const filesUser = await Prisma.file.findMany({
      where: { ownerId: userId, status: "upload", folderId: folder.folderId },
    });

    const dataUser = filesUser.map((file) => ({
      name: file.name,
      url: `${BASEURL}/content/${file.key}`,
      type: file.type,
    }));

    res.json(dataUser);
  } catch (err: any) {
    console.error("Error fetching folder content:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

folderRoute.get("/folder-name", userAuth, async (req, res) => {
  try {
    // @ts-expect-error
    const userId = req.user.userId;
    const folders = await Prisma.folder.findMany({
      where: {
        ownerId: userId,
      },
    });

    const userData = folders.map((folder, index) => ({
      id: index,
      name: folder.name,
    }));

    res.json(userData);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default folderRoute;
