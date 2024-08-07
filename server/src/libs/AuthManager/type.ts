import { Role } from "@/utils/constants.js";
import { CustomResponse } from "@/utils/CustomResponse.js";
import { DecodedUser } from "@/utils/DecodedUser.type.js";
import { Language } from "@/utils/Language.js";

export type AuthManager = {
  decodeUser: (token: string) => DecodedUser | null;
  checkRole: (role: Role, decodedUser?: DecodedUser) => boolean;
  encodeUser: (params: { decodedUser: DecodedUser; staySignedIn: boolean }) => string;
  hashPassword: (password: string) => string;
  comparePasswords: (password: string, hashedPassword: string) => boolean;
  generateRandomToken: () => string;
  facebookLogin: (params: {
    accessToken: string;
  }) => Promise<
    CustomResponse<
      { facebookId: string; name: string; email: string },
      "unknown_error" | "facebook_account_missing_email"
    >
  >;
  googleLogin: (params: { credential: string }) => Promise<
    CustomResponse<
      {
        googleId: string;
        name?: string;
        email?: string;
        language?: Language;
      },
      "unknown_error" | "invalid_token"
    >
  >;
};
