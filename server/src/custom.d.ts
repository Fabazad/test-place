import { DecodedUser } from "@/utils/DecodedUser.type";

declare global {
  namespace Express {
    interface Request {
      decoded?: DecodedUser;
    }
  }
}
