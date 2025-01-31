import express, { Request, Response } from "express";
import s3 from "../config/aws";
import { userAuth } from "../middleware/auth";
import Prisma from "../PrismaInit";

const UploadRouter = express.Router();

// Upload File

// Upload Multiple Files
UploadRouter.post(
  "/upload-multiple",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { files, folderName } = req.body; // Expecting an array of files
      //@ts-expect-error
      const userId = req.user?.userId; // Ensure userId is available

      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: "Files array is required" });
      }

      console.log(files);

      let folderId: string | null = null;

      if (folderName) {
        // Check if the folder already exists
        let existingFolder = await Prisma.folder.findFirst({
          where: { name: folderName, ownerId: userId },
        });

        // If folder does not exist, create it
        if (!existingFolder) {
          existingFolder = await Prisma.folder.create({
            data: {
              name: folderName,
              ownerId: userId,
              path: `${userId}/${folderName}`,
            },
          });
        }
        folderId = existingFolder.folderId;
      }

      // Generate pre-signed URLs for each file
      const uploadedFiles = await Promise.all(
        files.map(
          async (file: {
            fileName: string;
            fileType: string;
            fileSize: number;
          }) => {
            const { fileName, fileType, fileSize } = file;

            if (!fileName || !fileType || !fileSize) {
              throw new Error("fileName, fileType, and fileSize are required");
            }

            const s3Key = folderName
              ? `${userId}/${folderName}/${fileName}`
              : `${userId}/${fileName}`;

            // Store file metadata in the database
            const newFile = await Prisma.file.create({
              data: {
                name: fileName,
                type: fileType,
                key: s3Key,
                size: fileSize,
                ownerId: userId,
                access: false,
                status: "pending",
                folderId,
              },
            });

            // Generate pre-signed URL
            const params = {
              Bucket: process.env.AWS_S3_BUCKET,
              Key: s3Key,
              Expires: 60,
              ContentType: fileType,
            };

            const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

            return {
              fileId: newFile.fileId,
              fileName,
              uploadUrl,
              filePath: s3Key,
            };
          }
        )
      );

      res.status(200).json({ uploadedFiles });
    } catch (err: any) {
      console.error("Error generating pre-signed URLs:", err);
      res.status(500).json({
        error: "Failed to generate pre-signed URLs",
        details: err.message,
      });
    }
  }
);

// Update File Status After Upload
UploadRouter.post(
  "/file-uploaded",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { fileId, status } = req.body;

      if (!fileId || status === undefined) {
        return res
          .status(400)
          .json({ error: "fileId and status are required" });
      }

      await Prisma.file.update({
        where: { fileId },
        data: { status: "upload" },
      });

      res.status(200).json({ message: "File metadata updated successfully" });
    } catch (err: any) {
      console.error("Error updating file metadata:", err);
      res.status(500).json({ error: "Failed to update file metadata" });
    }
  }
);

// Create a "Folder" in S3
UploadRouter.post(
  "/create-folder",
  userAuth,
  async (req, res): Promise<any> => {
    try {
      const { folderName } = req.body;
      //@ts-expect-error
      const userId = req.user?.userId;

      if (!folderName) {
        return res.status(400).json({ error: "folderName is required" });
      }

      const s3Key = `${userId}/${folderName}/`; // Folder path

      // Creating an empty object with the folder path
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: "", // Empty body to simulate the folder
      };

      await s3.putObject(params).promise();

      // Save folder details in database
      const newFolder = await Prisma.folder.create({
        data: {
          name: folderName,
          ownerId: userId,
          path: s3Key, // Store folder path
        },
      });

      res.status(200).json({
        message: `Folder "${folderName}" created successfully!`,
        folder: newFolder,
      });
    } catch (err: any) {
      console.error("Error creating folder:", err);
      res.status(500).json({
        error: "Failed to create folder",
        details: err.message,
      });
    }
  }
);

export default UploadRouter;
