import z from "zod";
export const savedDataSchema = {
    createdAt: z.date(),
    updatedAt: z.date(),
    _id: z.string(),
};
