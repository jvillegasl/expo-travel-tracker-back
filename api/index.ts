import express from "express";
import authRouter from "./auth";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    res.json({ message: "Express on Vercel" });
});

app.use("/auth", authRouter);

export default app;
