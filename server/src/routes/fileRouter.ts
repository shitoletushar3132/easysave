import express, { Request, Response } from "express";
import s3 from "../config/aws"; // Your AWS S3 configuration
import Prisma from "../PrismaInit";
import { userAuth } from "../middleware/auth";
import mime from "mime-types";
import { BASEURL } from "../constant";

const fileRouter = express.Router();

fileRouter.get(
  "/content/*",
  userAuth,

  async (req: Request, res: Response) => {
    try {
      //@ts-expect-error
      const userId = req.user.userId;

      const fileName = req.path.split("/").pop() || "application/octet-stream";

      const mimeType = mime.lookup(fileName) || "application/octet-stream";
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Cache-Control", "max-age=3600");

      const s3Key = decodeURIComponent(req.path.split("/content/")[1]);

      const fileRecord = await Prisma.file.findFirst({
        where: { key: s3Key, ownerId: userId, deleted: false },
      });

      if (!fileRecord) {
        res.status(403).json({ error: "Unauthorized access to file" });
        return;
      }

      s3.getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${s3Key}`,
      })
        .createReadStream()
        .pipe(res)
        .on("error", (error: any) => {
          console.error("Error streaming file from S3:", error);
          res.status(500).json({ error: "Failed to fetch file from S3" });
        });
    } catch (err: any) {
      console.error("Error processing file request:", err);
      res
        .status(500)
        .json({ error: "Error processing file request", details: err.message });
    }
  }
);

fileRouter.get("/file-lists", userAuth, async (req, res) => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const filesUser = await Prisma.file.findMany({
      where: {
        ownerId: userId,
        status: "upload",
        folderId: null,
        deleted: false,
      },
    });

    const dataUser = filesUser.map((file) => ({
      fileId: file.fileId,
      name: file.name,
      url: `${BASEURL}/content/${file.key}`,
      type: file.type,
      key: file.key,
      date: new Date(file.createdAt).toISOString().split("T")[0],
      folderId: file.folderId,
    }));

    res.json(dataUser);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error processing file request", message: err.message });
  }
});

fileRouter.delete("/file", userAuth, async (req, res): Promise<any> => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const { fileId, key } = req.body;

    // Validate input
    if (!userId || !fileId || !key) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Provide valid data" });
    }

    // Check if the file exists and is not deleted
    const findFile = await Prisma.file.findFirst({
      where: { fileId, ownerId: userId, deleted: false },
    });

    if (!findFile) {
      return res
        .status(404)
        .json({ message: "File not found or already deleted" });
    }

    // Soft delete the file by setting `deleted` to true
    await Prisma.file.update({
      where: { fileId },
      data: { deleted: true },
    });

    return res
      .status(200)
      .json({ message: "File deleted successfully", success: true });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Error processing file request", message: err.message });
  }
});

fileRouter.get("/search/:value", userAuth, async (req, res): Promise<any> => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const { value } = req.params;

    const files = await Prisma.file.findMany({
      where: {
        ownerId: userId,
        status: "upload",
        deleted: false,
        OR: [
          {
            name: { contains: value, mode: "insensitive" },
          },
          { type: { contains: value, mode: "insensitive" } },
        ],
      },
    });

    const dataUser = files.map((file) => ({
      fileId: file.fileId,
      name: file.name,
      url: `${BASEURL}/content/${file.key}`,
      type: file.type,
      key: file.key,
      date: new Date(file.createdAt).toISOString().split("T")[0],
      folderId: file.folderId,
    }));

    return res.status(200).json({ success: true, dataUser });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Error In Searching File", message: err.message });
  }
});

export default fileRouter;
