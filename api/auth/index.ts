import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";

import { JWTPayload } from "../../types/jwt";
import { loginSchema, signupSchema } from "./schemas";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    const body = req.body;

    const validationResults = await signupSchema.safeParseAsync(body);

    if (!validationResults.success) {
        return res.status(400).json({ error: validationResults.error });
    }

    const data = validationResults.data;

    const hashedPassword = await bcrypt.hash(data.password, Number(process.env.JWT_SALT_ROUNDS));

    await sql`INSERT INTO AppUser (Username, Password) VALUES (${data.username}, ${hashedPassword})`;

    res.status(201).send();
});

authRouter.post("/login", async (req, res) => {
    const body = req.body;

    const validationResults = await loginSchema.safeParseAsync(body);

    if (!validationResults.success) {
        return res.status(400).json({ error: validationResults.error });
    }

    const data = validationResults.data;

    const queryResults = await sql<{ hashed_password: string }>`SELECT Password AS hashed_password FROM AppUser WHERE Username = ${data.username}`;

    const hashedPassword = queryResults.rows[0].hashed_password;
    const results = await bcrypt.compare(data.password, hashedPassword);

    if (!results) {
        return res.status(401).json({ message: "Wrong password" });
    }

    const payload: JWTPayload = { username: data.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ token });
});

export default authRouter;
