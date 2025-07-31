import express, { Request, Response } from "express";
import { folderSchema } from "../zod/folderSchema";
import Folder from "../models/folder";
import Image from "../models/image";
const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
    const { folderName, isRoot, parent } = req.body;
    const result = folderSchema.safeParse({ folderName, isRoot, parent });
    if (!result.success) {
        res.status(400).json({
            error: "Invalid input",
            details: result.error.errors
        });
        return;
    }
    // check if user already exists
    if (isRoot) {
        try {
            const newFolder = await Folder.create({ name: folderName, isRoot: true, owner: req.user });
            res.status(200).json({ folderId: newFolder?._id, message: "Folder created successfully!" });
            return;
        } catch (err) {
            res.status(400).json({ error: "Error creating folder" });
            return;
        }
    } else {
        try {
            const parentFolder = await Folder.findById(parent);
            if (parentFolder) {
                const newFolder = await Folder.create({ name: folderName, isRoot: false, parent: parentFolder._id, owner: req.user })
                parentFolder.child.push(newFolder._id);
                await parentFolder.save();
                res.status(200).json({ folderId: newFolder?._id, message: "Folder created successfully!" });
                return;
            }
            else {
                res.status(400).json({ error: "Parent Folder not found" });
                return;
            }
        } catch (err) {
            res.status(400).json({ error: "Error creating folder" });
            return;
        }
    }
});

router.get('/root', async (req: Request, res: Response) => {
    try {
        const rootFolders = await Folder.find({ isRoot: true, owner: req.user }).populate('owner', '_id fullname username');
        const rootImages = await Image.find({ isRoot: true, owner: req.user }).populate('owner', '_id fullname username');
        res.status(200).json({ folders: rootFolders, images: rootImages });
        return;
    } catch (err) {
        res.status(400).json({ error: "Error fetching folder" });
        return;
    }
});

router.get('/:folderId', async (req: Request, res: Response) => {
    const { folderId } = req.params;
    try {
        const childFolders = await Folder.findById(folderId)
            .populate({
                path: "child",
                populate: { path: "owner", select: "_id fullname username" }
            })
            .populate({
                path: "childImages",
                populate: { path: "owner", select: "_id fullname username" }
            })
            .populate('owner', '_id fullname username');
        res.status(200).json({ success: true, allData: childFolders });
        return;

    } catch (err) {
        res.status(400).json({ error: "Error fetching folders" });
        return;
    }
});

export default router;