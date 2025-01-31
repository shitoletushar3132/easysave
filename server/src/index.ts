import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import cookie from "cookie-parser";
import UploadRouter from "./routes/upload";
import folderRoute from "./routes/folderRoutes";
import fileRouter from "./routes/fileRouter";
import publicRouter from "./routes/publicRouter";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookie());

app.use("/", fileRouter);
app.use("/", authRouter);
app.use("/", UploadRouter);
app.use("/", folderRoute);
app.use("/", publicRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("hello hool");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
