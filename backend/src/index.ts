import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./lib/db";
import authRoutes from "./routes/auth";
import folderRoutes from "./routes/folder";
import imageRoutes from "./routes/images";
import authMiddleware from "./middleware/authMiddleware";
dotenv.config();
const port = process.env.PORT || 4000

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// UnProtected Routes
app.use("/auth", authRoutes);

// Protected Middleware
app.use(authMiddleware);

// Protected Routes
app.use("/folder", folderRoutes);
app.use("/image", imageRoutes);

app.listen(port, async ()=>{
    console.log("app is listening on port "+port)
    await connectDB();
})