import { RequestHandler  } from "express"
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user?: string;
        }
    }
}

const authMiddleware : RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token, authorization denied" })
        return;
    }

    const token = authHeader.split(" ")[1]

    try {
        const secret = process.env.JWT_SECRET as string
        const decoded = jwt.verify(token, secret)
        if(decoded==null || typeof decoded === "string") {
            res.status(401).json({
                error: "Invalid token"
            });
            return;
        }
        // Optionally attach user info to request
        req.user = decoded.id
        next()
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" })
        return;
    }
}

export default authMiddleware