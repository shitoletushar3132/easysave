import express, { Request, Response } from "express";
import s3 from "../config/aws"; // Your AWS S3 configuration
import Prisma from "../PrismaInit";
import { userAuth } from "../middleware/auth";
import mime from "mime-types";
import { BASEURL } from "../constant";

const getImages = express.Router();

getImages.get(
  "/content/*",
  userAuth,

  async (req: Request, res: Response) => {
    try {
      //@ts-expect-error
      const userId = req.user.userId;

      const fileName = req.path.split("/").pop() || "application/octet-stream";

      const mimeType = mime.lookup(fileName) || "application/octet-stream";
      // res.setHeader("Content-Type", mimeType);
      // res.setHeader("Cache-Control", "max-age=3600");

      const s3Key = decodeURIComponent(req.path.split("/content/")[1]);

      const fileRecord = await Prisma.file.findFirst({
        where: { key: s3Key, ownerId: userId },
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

getImages.get("/file-lists", userAuth, async (req, res) => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const filesUser = await Prisma.file.findMany({
      where: { ownerId: userId, status: "upload", folderId: null },
    });

    const dataUser = filesUser.map((file) => ({
      name: file.name,
      url: `${BASEURL}/content/${file.key}`,
      type: file.type,
    }));

    res.json(dataUser);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error processing file request", message: err.message });
  }
});


export default getImages;
