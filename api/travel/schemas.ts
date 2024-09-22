import { z } from "zod";
import { DateTimeOffset } from "../../lib/models/dateTimeOffset";

export const newTravelSchema = z
    .object({
        description: z.string().min(1),
        plannedStartDate: z
            .string()
            .datetime({ offset: true })
            .transform((t) => new DateTimeOffset(t)),
        plannedEndDate: z
            .string()
            .datetime({ offset: true })
            .transform((t) => new DateTimeOffset(t)),
    })
    .refine((t) => t.plannedStartDate < t.plannedEndDate, { message: "End date must be after start date", path: ["plannedEndDate"] });
