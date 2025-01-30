import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import cookie from "cookie-parser";
import getImages from "./routes/getImages";
import UploadRouter from "./routes/upload";
import folderRoute from "./routes/folderRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookie());

app.use("/", getImages);
app.use("/", authRouter);
app.use("/", UploadRouter);
app.use("/", folderRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("hello hool");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
