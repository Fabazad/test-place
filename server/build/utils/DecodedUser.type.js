import { z } from "zod";
import { Role } from "./constants.js";
import { getEnumValues } from "./enum.js";
export const decodedUserSchema = z.object({
    roles: z.array(z.enum(getEnumValues(Role))),
    userId: z.string(),
    amazonId: z.string().optional(),
});
export const isDecodedUser = (decodedUser) => {
    return decodedUserSchema.safeParse(decodedUser).success;
};
