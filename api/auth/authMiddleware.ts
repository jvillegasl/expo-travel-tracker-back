import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants";

const authMiddleware: RequestHandler = (req, res, next) => {
    const header = req.header("Authorization") || "";

    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token not provied" });
    }

    try {
        jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token not valid" });
    }
};

export default authMiddleware;
