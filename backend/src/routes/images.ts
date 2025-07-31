import express, { Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import Image from "../models/image";
import Folder from "../models/folder";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary";

// Configure Multer for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } //10 MB
});

router.post('/', upload.single("file"), async (req: Request, res: Response) => {
    const { folderId, fileName, isRoot } = req.body;
    const session = await mongoose.startSession();
    if (!fileName) {
        res.status(400).json({ error: "Not Valid Inputs" });
        return;
    }
    try {
        const imageBuffer = req.file?.buffer;
        if (!imageBuffer) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "image_drive_uploads"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(imageBuffer);
        });

        const imageUrl = uploadResult.secure_url;

        const imageObject: {
            url: string;
            name: string;
            isRoot?: boolean;
            parent?: string;
            owner?: string;
        } = { url: imageUrl, name: fileName, owner: req.user };
        
        let imageData
        if (isRoot === "true") {
            imageObject.isRoot = true;
            imageData = await Image.create(imageObject);
        } else {
            imageObject.isRoot = false;
            imageObject.parent = folderId;

            // MONGO DB TRANSACTION STARTS
            session.startTransaction();
            const imageData = await Image.create(imageObject);
            console.log(folderId)
            const parent = await Folder.findById(folderId);
            if(parent==null){
                await session.abortTransaction();
                throw new Error("Parent Folder not found!");
            }
            parent.childImages.push(imageData._id);
            await parent.save();

            await session.commitTransaction();
            // MONGO DB TRANSACTION COMMITED
            session.endSession();
            // MONGO DB TRANSACTION ENDS
        }
        res.json({ success: true, imageData: imageData }); 
        return;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({ success: false, message: "Upload failed", error: (error as Error).message });
        return;
    }
});

router.get('/search/:query', async (req: Request, res: Response) => {
    const { query } = req.params;
    try {
        const searchData = await Image.find({
            name: { $regex: new RegExp(query, 'i') },
            owner: req.user
        }).populate({ path: "owner", select: "_id fullname username" });
        res.status(200).json({ success: true, searchData });
        return;

    } catch (err) {
        res.status(400).json({ error: "Error fetching search results" });
        return;
    }
});
export default router;
