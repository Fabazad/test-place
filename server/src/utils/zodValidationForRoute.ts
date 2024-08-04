import { BadRequestError } from "@/utils/exceptions/index.js";
import { z } from "zod";
import { formatZodError } from "./formatZodError.js";

export const zodValidationForRoute = <Schema extends z.Schema>(
  data: unknown,
  schema: Schema
): z.infer<Schema> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new BadRequestError(formatZodError(result.error));
  }
  return result.data;
};
