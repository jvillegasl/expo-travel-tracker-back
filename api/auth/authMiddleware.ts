import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { JWTPayload } from "../../types/jwt";

const authMiddleware: RequestHandler = (req, res, next) => {
    const header = req.header("Authorization") || "";

    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token not provied" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token not valid" });
    }
};

export default authMiddleware;
