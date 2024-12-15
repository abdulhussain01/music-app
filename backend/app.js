import express from "express";
import dbConnect from "./db/dbConnect.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/user.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import { errorHandler } from "./middleware/handleError.js";
import cors from "cors";
import path from "path";

const app = express();
dotenv.config();

const __dirname = path.resolve();

app.use(
  cors({
    origin: [process.env.MUSICAPP_URL],

    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/test", (req, res) => {
  res.status(200).json({
    message: "working",
    success: true,
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

dbConnect();

app.use(errorHandler);
export default app;
