
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4227b0cb-8fa1-5f8c-857b-636a0e0785d4")}catch(e){}}();
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
//# sourceMappingURL=DecodedUser.type.js.map
//# debugId=4227b0cb-8fa1-5f8c-857b-636a0e0785d4
