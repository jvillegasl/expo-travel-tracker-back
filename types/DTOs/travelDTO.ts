import { Expose, Transform } from "class-transformer";

import { DateTimeOffset } from "../../lib/models/dateTimeOffset";
import { Travel } from "../models/travel";

export class TravelDTO {
    @Expose()
    id!: number;

    @Expose()
    description!: string;

    @Expose()
    @Transform(({ obj: { planned_start_date: date, planned_start_date_offset: offset } }: { obj: Travel }) => new DateTimeOffset(date, offset))
    plannedStartDate!: DateTimeOffset;

    @Expose()
    @Transform(({ obj: { planned_end_date: date, planned_end_date_offset: offset } }: { obj: Travel }) => new DateTimeOffset(date, offset))
    plannedEndDate!: DateTimeOffset;

    @Expose()
    @Transform(({ obj: { created_at } }: { obj: Travel }) => new Date(created_at))
    createdAt!: Date;

    @Expose()
    @Transform(({ obj: { updated_at } }: { obj: Travel }) => (updated_at ? new Date(updated_at) : undefined))
    updatedAt?: Date;
}
