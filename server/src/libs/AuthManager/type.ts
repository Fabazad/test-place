import { Role } from "@/utils/constants.js";
import { DecodedUser } from "@/utils/DecodedUser.type.js";

export type AuthManager = {
  decodeUser: (token: string) => Promise<DecodedUser | null>;
  checkRole: (decodedUser: DecodedUser, role: Role) => boolean;
  encodeUser: (params: { decodedUser: DecodedUser; staySignedIn: boolean }) => string;
  hashPassword: (password: string) => string;
  comparePasswords: (password: string, hashedPassword: string) => boolean;
  generateRandomToken: () => string;
};
