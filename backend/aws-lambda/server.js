import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";
import channelRoutes from "./routes/channel.js";
import commentRoutes from "./routes/comment.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors({ origin: "https://youtube-clone-619.netlify.app/", credentials: true }));
app.use(cookieParser());
app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);

/* -------------------- TEST ROUTE -------------------- */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Youtube clone backend is running on AWS Lambda 🚀",
  });
});

/* -------------------- DB CONNECTION FLAG -------------------- */
let isConnected = false;

/* -------------------- SERVERLESS WRAPPER -------------------- */
const server = serverless(app);

/* -------------------- LAMBDA HANDLER -------------------- */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Database connection failed" }),
    };
  }

  return server(event, context);
};
