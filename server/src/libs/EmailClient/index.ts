import { createSingletonGetter } from "@/utils/singleton";
import { EmailClient } from "./type";

const createEmailClient = (): EmailClient => {
  return {};
};

export const getEmailClient = createSingletonGetter(createEmailClient);
