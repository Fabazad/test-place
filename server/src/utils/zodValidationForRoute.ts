import { BadRequestError } from "@/utils/exceptions";
import { formatZodError } from "@/utils/formatZodError";
import { z } from "zod";

export const zodValidationForRoute = <Schema extends z.Schema>(
  data: unknown,
  schema: Schema
): z.infer<Schema> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new BadRequestError(1, formatZodError(result.error));
  }
  return result.data;
};
