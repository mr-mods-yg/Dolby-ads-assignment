import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    child: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    }],
    childImages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    isRoot: {type: mongoose.Schema.Types.Boolean, required: true}
}, { timestamps: true });

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;