import express, { Request, Response } from "express";
import s3 from "../config/aws"; // Your AWS S3 configuration
import Prisma from "../PrismaInit";
import { userAuth } from "../middleware/auth";
import mime from "mime-types"; // For dynamic content type based on file extension

const getImages = express.Router();

// Function to determine the file type based on the file extension
const getFileType = (fileName: string) => {
  if (fileName !== "") {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "image";
      case "pdf":
        return "pdf";
      case "mp4":
      case "avi":
      case "mov":
      case "mkv":
        return "video";
      case "doc":
      case "docx":
        return "doc";
      case "xls":
      case "xlsx":
        return "xls";
      default:
        return "other"; // For other file types
    }
  }
  return "other"; // Default case if no extension
};

// Route to fetch the list of files from the S3 bucket
getImages.get("/content", async (req, res) => {
  try {
    const bucketName = { Bucket: process.env.AWS_S3_BUCKET };

    s3.listObjectsV2(bucketName, (err: any, data: any) => {
      if (err) {
        console.error("Error fetching file list:", err);
        return res.status(500).json({ error: "Error fetching file list" });
      }

      const files = data.Contents?.map((file: any) => ({
        name: file.Key,
        url: `http://localhost:3000/content/${file.Key}`, // Proxy URL
        type: getFileType(file.Key),
      }));

      res.json(files);
    });
  } catch (err: any) {
    console.error("Error fetching files:", err);
    res.status(500).json({
      error: "Failed to fetch files",
      details: err.message,
    });
  }
});

// Route to stream the file from S3
getImages.get(
  "/content/:folderName/:fileName",
  async (req: Request, res: Response) => {
    try {
      const fileName = req.params.fileName;
      const folderName = req.params.folderName;

      // Generate the pre-signed URL
      const params = {
        Bucket: process.env.AWS_S3_BUCKET, // Your S3 bucket name
        Key: `${folderName}/${fileName}`, // File path
        Expires: 60, // URL expiry time in seconds
      };

      // Generate the pre-signed URL
      s3.getSignedUrl("getObject", params, (err: any, url: any) => {
        if (err) {
          console.error("Error generating pre-signed URL:", err);
          return res.status(500).json({ error: "Failed to generate URL" });
        }

        // Set the correct MIME type based on the file extension
        const mimeType = mime.lookup(fileName) || "application/octet-stream";
        res.setHeader("Content-Type", mimeType); // Set dynamic content type

        // Set caching headers (optional)
        res.setHeader("Cache-Control", "max-age=3600"); // Cache the file for 1 hour

        // Use the pre-signed URL to directly stream the file to the client
        s3.getObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${folderName}/${fileName}`,
        })
          .createReadStream()
          .pipe(res) // Pipe the S3 file stream to the response
          .on("error", (error: any) => {
            console.error("Error streaming file from S3:", error);
            res.status(500).json({ error: "Failed to fetch file from S3" });
          });
      });
    } catch (err: any) {
      console.error("Error processing file request:", err);
      res
        .status(500)
        .json({ error: "Error processing file request", details: err.message });
    }
  }
);

getImages.get("/content1", userAuth, async (req, res) => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const filesUser = await Prisma.file.findMany({
      where: { ownerId: userId, status: "upload" },
    });

    const dataUser = filesUser.map((file) => ({
      name: file.name,
      url: `http://localhost:3000/content/${file.key}`,
      type: file.type,
    }));

    res.json(dataUser);

    console.log(dataUser);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error processing file request", message: err.message });
  }
});

getImages.get("/folder-name", userAuth, async (req, res) => {
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
    res
      .status(500)
      .json({ error: "Error processing file request", message: err.message });
  }
});

export default getImages;
