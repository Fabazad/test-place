import { DecodedUser } from "@/utils/DecodedUser.type.js";

declare global {
  namespace Express {
    interface Request {
      decoded?: DecodedUser;
    }
  }
}
