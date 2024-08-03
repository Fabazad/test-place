import { User } from "../user.entity";

export type UserDAO = {
  getUser: (params: { userId: string }) => Promise<User | null>;
  setIsCertified: (params: { userId: string; isCertified: boolean }) => Promise<void>;
};
