import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    isRoot: {type: mongoose.Schema.Types.Boolean, required: true}
}, { timestamps: true });

const Image = mongoose.model("Image", imageSchema);
export default Image;