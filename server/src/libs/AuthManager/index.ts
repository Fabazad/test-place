import { configs } from "@/configs.js";
import { Role } from "@/utils/constants.js";
import { DecodedUser, isDecodedUser } from "@/utils/DecodedUser.type.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthManager } from "./type.js";

const createAuthManager = (): AuthManager => {
  const secret = configs.JWT_KEY;
  const longSignInDuration = configs.LONG_SIGN_IN_DURATION;
  const shortSignInDuration = configs.SHORT_SIGN_IN_DURATION;
  const saltRounds = configs.SALT_ROUNDS;

  return {
    decodeUser: async (token: string) => {
      const decoded = jwt.verify(token, secret);
      if (isDecodedUser(decoded)) return decoded;
      return null;
    },
    checkRole: (decodedUser: DecodedUser, role: Role) => {
      return decodedUser.roles.includes(role) || decodedUser.roles.includes(Role.ADMIN);
    },
    encodeUser: ({ decodedUser: { userId, roles, amazonId }, staySignedIn }) => {
      const payload = { userId, roles, amazonId };
      return jwt.sign(payload, secret, {
        expiresIn: staySignedIn ? shortSignInDuration : longSignInDuration,
      });
    },
    hashPassword: (password: string) => {
      return bcrypt.hashSync(password, saltRounds);
    },
    comparePasswords: (password: string, hashedPassword: string) => {
      return bcrypt.compareSync(password, hashedPassword);
    },
    generateRandomToken: () => {
      return Array.from({ length: 16 }, () => {
        const charCode = Math.floor(Math.random() * 62);
        if (charCode < 10) {
          return String.fromCharCode(charCode + 48); // 0-9
        } else if (charCode < 36) {
          return String.fromCharCode(charCode + 55); // A-Z
        } else {
          return String.fromCharCode(charCode + 61); // a-z
        }
      }).join("");
    },
  };
};

export const getAuthManager = createSingletonGetter(createAuthManager);
