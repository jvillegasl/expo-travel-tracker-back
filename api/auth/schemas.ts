import { sql } from "@vercel/postgres";
import { z } from "zod";

export const signupSchema = z
    .object({
        username: z.string().min(1),
        password: z.string().min(8),
        confirmPassword: z.string(),
    })
    .refine(
        async (t) => {
            const queryResults = await sql<{ count: number }>`SELECT COUNT(*) AS Count FROM AppUser WHERE Username = ${t.username}`;

            const usersCount = Number(queryResults.rows[0].count);

            return usersCount === 0;
        },
        { path: ["username"], message: "Username already exists" },
    )
    .refine((t) => t.password === t.confirmPassword, { path: ["password"] });

export const loginSchema = z
    .object({
        username: z.string().min(1),
        password: z.string().min(1),
    })
    .refine(
        async (t) => {
            const queryResults = await sql<{ count: number }>`SELECT COUNT(*) AS Count FROM AppUser WHERE Username = ${t.username}`;

            const usersCount = Number(queryResults.rows[0].count);

            return usersCount > 0;
        },
        { path: ["username"], message: "Username does not exist" },
    );
