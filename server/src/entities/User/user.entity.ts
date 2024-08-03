import { Role } from "@/utils/constants";
import { Language } from "@/utils/Language";
import { savedDataSchema } from "@/utils/savedDataSchema";
import z from "zod";

export const userDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().nullish().default(null),
  emailValidation: z.boolean().default(false),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  amazonId: z.string(),
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
export type UserData = z.infer<typeof userDataSchema>;

export const userSchema = userDataSchema.extend(savedDataSchema);
export type User = z.infer<typeof userSchema>;
