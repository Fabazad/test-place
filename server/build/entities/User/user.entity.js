
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="97e6cdee-ad45-5084-84f4-dc97dcef4729")}catch(e){}}();
import { Role } from "../../utils/constants.js";
import { Language } from "../../utils/Language.js";
import { savedDataSchema } from "../../utils/savedDataSchema.js";
import z from "zod";
export const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().nullish().default(null),
    emailValidation: z.boolean().default(false),
    resetPasswordToken: z.string().optional(),
    resetPasswordExpires: z.date().optional(),
    amazonId: z.string().optional(),
    testerMessage: z.string().optional(),
    sellerMessage: z.string().optional(),
    roles: z.array(z.nativeEnum(Role)).min(1),
    paypalEmail: z.string().email().optional(),
    lastLogin: z.date().optional(),
    googleId: z.string().nullish(),
    facebookId: z.string().nullish(),
    language: z.nativeEnum(Language),
    isCertified: z.boolean().default(false),
});
export const userSchema = userDataSchema.extend(savedDataSchema);
//# sourceMappingURL=user.entity.js.map
//# debugId=97e6cdee-ad45-5084-84f4-dc97dcef4729
