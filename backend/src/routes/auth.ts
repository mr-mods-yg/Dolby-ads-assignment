import express, { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signupSchema, loginSchema } from "../zod/authSchema";
const router = express.Router();


router.post('/signup', async (req: Request, res: Response) => {
    const { username, password, fullname } = req.body;
    const result = signupSchema.safeParse({ username, password, fullname });
    if (!result.success) {
        res.status(400).json({
            error: "Invalid input",
            details: result.error.errors
        });
        return;
    }
    // check if user already exists
    const exisitingUser = await User.findOne({ username });
    if(exisitingUser) {
        res.status(400).json({
            error: "User already exists",
        });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({
        username,
        password: hashedPassword,
        fullname
    });
    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
});

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
        res.status(400).json({
            error: "Invalid username/password",
            details: result.error.errors
        });
        return;
    }
    const exisitingUser = await User.findOne({username });
    if(!exisitingUser) {
        res.status(400).json({
            error: "User not found!",
        });
        return;
    }
    const isPasswordValid = await bcrypt.compare(password, exisitingUser.password);
    if(!isPasswordValid) {
        res.status(400).json({
            error: "Invalid username/password",
        });
        return;
    }
    const token = jwt.sign({ id: exisitingUser._id },
        process.env.JWT_SECRET || "iwantrecognition:(",
        {expiresIn: "7d"}
    );
    res.status(200).json({
        message: "Login successful!",
        token,
        user: {
            id: exisitingUser._id,
            username: exisitingUser.username,
            fullname: exisitingUser.fullname,
            profilePic: exisitingUser.profilePic
        }
    });
});

router.post("/check", async (req: Request, res: Response) => {
    let {token} = req.body;
    token = token.split(" ")[1];
    if(!token){
        res.status(401).json({
            error: "No token provided"
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "iwantrecognition:(");
        if(decoded==null || typeof decoded === "string") {
            res.status(401).json({
                error: "Invalid token"
            });
            return;
        }
        
        const exisitingUser = await User.findOne({ _id: decoded.id });
        if(!exisitingUser) {
            res.status(401).json({
                error: "User not found"
            });
            return;
        }
        res.status(200).json({
            message: "Token is valid",
            user: {
                id: exisitingUser._id,
                username: exisitingUser.username,
                fullname: exisitingUser.fullname,
                profilePic: exisitingUser.profilePic
            }
        });
    } catch (error) {
        res.status(401).json({
            error: "Invalid token"
        });
    }
    
    
})
export default router;