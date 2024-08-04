import { z } from "zod";
import { Role } from "./constants.js";
import { getEnumValues } from "./enum.js";

export const decodedUserSchema = z.object({
  roles: z.array(z.enum(getEnumValues(Role))),
  userId: z.string(),
});

export type DecodedUser = z.infer<typeof decodedUserSchema>;

export const isDecodedUser = (decodedUser: unknown): decodedUser is DecodedUser => {
  return decodedUserSchema.safeParse(decodedUser).success;
};
