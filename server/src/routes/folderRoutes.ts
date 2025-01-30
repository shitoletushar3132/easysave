import express from "express";
import Prisma from "../PrismaInit";
import { userAuth } from "../middleware/auth";
import { BASEURL } from "../constant";

const folderRoute = express.Router();

folderRoute.get("/folder-name", userAuth, async (req, res) => {
  try {
    // @ts-expect-error
    const userId = req.user.userId;
    const folders = await Prisma.folder.findMany({
      where: {
        ownerId: userId,
        deleted: false,
      },
    });

    const userData = folders.map((folder, index) => ({
      folderId: folder.folderId,
      name: folder.name,
      path: folder.path,
    }));

    res.json(userData);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

folderRoute.get("/folder-content/:folderName", userAuth, async (req, res) => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const { folderName } = req.params;

    const folder = await Prisma.folder.findFirst({
      where: { name: folderName, ownerId: userId, deleted: false },
    });

    if (!folder) {
      res
        .status(404)
        .json({ error: "Folder not found or unauthorized access" });
      return;
    }

    const filesUser = await Prisma.file.findMany({
      where: {
        ownerId: userId,
        status: "upload",
        folderId: folder.folderId,
        deleted: false,
      },
    });

    const dataUser = filesUser.map((file) => ({
      fileId: file.fileId,
      name: file.name,
      url: `${BASEURL}/content/${file.key}`,
      type: file.type,
      key: file.key,
    }));

    res.json(dataUser);
  } catch (err: any) {
    console.error("Error fetching folder content:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

folderRoute.delete("/folder-name", userAuth, async (req, res): Promise<any> => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const { folderId, folderName } = req.body;

    // Validate input
    if (!userId || !folderId || !folderName) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Provide valid data" });
    }

    // Check if the file exists and is not deleted
    const findFolder = await Prisma.folder.findFirst({
      where: { folderId, ownerId: userId, deleted: false },
    });

    if (!findFolder || findFolder.deleted) {
      return res
        .status(404)
        .json({ message: "Folder not found or already deleted" });
    }

    // Soft delete the file by setting `deleted` to true
    await Prisma.file.updateMany({
      where: { folderId },
      data: { deleted: true },
    });

    await Prisma.folder.update({
      where: { folderId },
      data: { deleted: true },
    });

    return res
      .status(200)
      .json({ message: "Folder deleted successfully", success: true });
  } catch (err: any) {
    console.error("Error fetching folder content:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default folderRoute;
