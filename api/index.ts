import express from "express";
import authRouter from "./auth";
import travelRouter from "./travel";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    res.json({ message: "Express on Vercel" });
});

app.use("/auth", authRouter);
app.use("/auth/travel", travelRouter);

export default app;
