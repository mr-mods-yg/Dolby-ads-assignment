import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;