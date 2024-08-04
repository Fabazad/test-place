import z from "zod";

export const formatZodError = (errors: z.ZodError): string => {
  return errors.issues.reduce((acc, key) => {
    return `${acc}\n${key.path.join(".")}: ${key.message}`;
  }, "");
};
