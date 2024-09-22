import { Router } from "express";
import authMiddleware from "../auth/authMiddleware";
import { sql } from "@vercel/postgres";
import { newTravelSchema } from "./schemas";

const travelRouter = Router();

travelRouter.use(authMiddleware);

travelRouter.get("/", async (req, res) => {
    const user = req.user!;

    const queryResults = await sql<{ id: number; description: string; planned_start_date: string; planned_end_date: string }>`
        SELECT
            T.*
        FROM Travel AS T
            JOIN AppUser AS AP ON AP.Id = T.user_id
        WHERE AP.Username = ${user.username}
    `;

    const travels = queryResults.rows;

    return res.status(200).json({ travels });
});

travelRouter.post("/", async (req, res) => {
    const body = req.body;

    const validationResults = await newTravelSchema.safeParseAsync(body);

    if (!validationResults.success) {
        return res.status(400).json({ error: validationResults.error });
    }

    const data = validationResults.data;

    const description = data.description;
    const plannedStartDate = data.plannedStartDate.toDate().toISOString();
    const plannedStartDateOffset = data.plannedStartDate.utcOffset();
    const plannedEndDate = data.plannedEndDate.toDate().toISOString();
    const plannedEndDateOffset = data.plannedEndDate.utcOffset();

    const user = req.user!;

    try {
        await sql`
            INSERT INTO Travel
            (
                description,
                planned_start_date,
                planned_start_date_offset,
                planned_end_date,
                planned_end_date_offset,
                user_id
            )
            SELECT
                ${description},
                ${plannedStartDate},
                ${plannedStartDateOffset},
                ${plannedEndDate},
                ${plannedEndDateOffset},
                AP.Id
            FROM AppUser AS AP
            WHERE AP.Username = ${user.username}
        `;

        return res.status(201).send();
    } catch (error) {
        return res.status(500).send({ error });
    }
});

export default travelRouter;
