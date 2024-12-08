import { UserController } from "@/controllers/user.controller.js";
import { getDatabaseConnection } from "databaseConnection/index.js";
import { z } from "zod";

const setIsCertifiedSeller = async () => {
  const { sellerId, isCertified } = z
    .object({
      sellerId: z.string(),
      isCertified: z.coerce.boolean(),
    })
    .parse({ sellerId: process.argv[2], isCertified: process.argv[3] });

  const databaseConnection = getDatabaseConnection();

  try {
    await databaseConnection.connect();
    const result = await UserController.setUserCertification({
      userId: sellerId,
      isCertified,
    });

    console.log(result);
  } catch (err: any) {
    console.error(err);
  } finally {
    await databaseConnection.disconnect();
  }
};

setIsCertifiedSeller();
