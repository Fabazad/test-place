import { Role } from "@/utils/constants.js";
import { Language } from "@/utils/Language.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
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
  affiliatedBy: z.string({ description: "User" }).optional(),
  personalAffiliationRateInPercent: z.number().optional(),
});
export type UserData = z.infer<typeof userDataSchema>;

export const userSchema = userDataSchema
  .extend(savedDataSchema)
  .omit({ affiliatedBy: true })
  .extend({
    affiliated: z
      .object({
        by: z.string({ description: "User" }),
        rateInPercent: z.number(),
      })
      .optional(),
  });
export type User = z.infer<typeof userSchema>;
export type UserWithoutPassword = Omit<User, "password">;
