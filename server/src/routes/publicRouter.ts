import express from "express";
import { userAuth } from "../middleware/auth"; // Middleware to check if user is authenticated
import Prisma from "../PrismaInit"; // Prisma ORM for DB operations
import { BASEURL, PUBLICURL } from "../constant"; // Base URL for generating links
import s3 from "../config/aws"; // S3 configuration for file handling

const publicRouter = express.Router();

// POST route to share a file by making it publicly accessible
publicRouter.post("/share/file", userAuth, async (req, res): Promise<any> => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const { fileId, key } = req.body;

    // Validate input data
    if (!userId || !fileId || !key) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Provide valid data" });
    }

    // Check if the file exists and belongs to the authenticated user
    const findFile = await Prisma.file.findFirst({
      where: { fileId, ownerId: userId, deleted: false, status: "upload" },
    });

    // If file is not found, return an error message
    if (!findFile) {
      return res
        .status(404)
        .json({ message: "File not found or unauthorized access" });
    }

    // Update the file to set access to true (make it publicly accessible)
    const updatedFile = await Prisma.file.update({
      where: { fileId, ownerId: userId },
      data: { access: true },
    });

    // Generate a shareable link for the file
    const shareLink = `${PUBLICURL}/transfer/file/${updatedFile.ownerId}/${updatedFile.key}`;

    // Send the success response with the generated share link
    return res.status(200).json({
      message: "File Link Should Be Available For Public Access",
      shareLink,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Error processing file request", message: err.message });
  }
});

publicRouter.get("/share/files", userAuth, async (req, res): Promise<any> => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;
    const filesUser = await Prisma.file.findMany({
      where: {
        ownerId: userId,
        status: "upload",
        deleted: false,
        access: true,
      },
    });

    const dataUser = filesUser.map((file) => ({
      fileId: file.fileId,
      name: file.name,
      url: `${PUBLICURL}/transfer/file/${userId}/${file.key}`,
      date: new Date(file.updatedAt).toISOString().split("T")[0],
      type: file.type,
      key: file.key,
    }));

    res.json(dataUser);
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Error processing file request", message: err.message });
  }
});

publicRouter.patch("/share/file", userAuth, async (req, res): Promise<any> => {
  try {
    //@ts-expect-error
    const userId = req.user.userId;

    const { fileId, key } = req.body;

    // Validate input data
    if (!userId || !fileId || !key) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Provide valid data" });
    }

    const findFile = await Prisma.file.findFirst({
      where: { fileId, ownerId: userId, deleted: false, status: "upload" },
    });

    // If file is not found, return an error message
    if (!findFile) {
      return res
        .status(404)
        .json({ message: "File not found or unauthorized access" });
    }

    const updatedFile = await Prisma.file.update({
      where: { fileId, ownerId: userId },
      data: { access: false },
    });

    return res.status(200).json({
      message: `${updatedFile.name} file accessible change successfully `,
    });
  } catch (err: any) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Error processing file request", message: err.message });
  }
});

// GET route to fetch the shared file by ownerId and key
publicRouter.get(
  "/transfer/file/:ownerId/*",
  async (req, res): Promise<any> => {
    try {
      const { ownerId } = req.params;

      //@ts-expect-error
      const key = req.params[0];

      const file = await Prisma.file.findFirst({
        where: {
          ownerId,
          key,
          access: true,
        },
      });

      if (!file) {
        return res
          .status(404)
          .json({ message: "File not found or not accessible" });
      }

      s3.getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${file.key}`,
      })
        .createReadStream()
        .pipe(res)
        .on("error", (error: any) => {
          console.error("Error streaming file from S3:", error);
          res.status(500).json({ error: "Failed to fetch file from S3" });
        });
    } catch (err: any) {
      return res.status(500).json({
        error: "Error processing file request",
        message: err.message,
      });
    }
  }
);

export default publicRouter;
