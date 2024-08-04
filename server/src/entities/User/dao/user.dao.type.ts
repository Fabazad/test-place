import { UserWithoutPassword } from "../user.entity.js";

export type UserDAO = {
  getUser: (params: { userId: string }) => Promise<UserWithoutPassword | null>;
  setIsCertified: (params: {
    userId: string;
    isCertified: boolean;
  }) => Promise<UserWithoutPassword | null>;
};
