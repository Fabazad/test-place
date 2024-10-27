import z from "zod";

export const savedDataSchema = {
  createdAt: z.date(),
  updatedAt: z.date(),
  _id: z.string(),
};

export const omittedSavedDataSchema = {
  createdAt: true,
  updatedAt: true,
  _id: true,
} as const;
