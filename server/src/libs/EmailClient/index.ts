import { createSingletonGetter } from "@/utils/singleton.js";
import { EmailClient } from "./type.js";

const createEmailClient = (): EmailClient => {
  return {
    sendContactUsMail: async ({ email, name, language, message }) => {
      console.log("sendContactUsMail", { email, name, language, message });
    },
    sendValidateMailAddressMail: async ({ email, userId, language }) => {
      console.log("sendValidateMailAddressMail", { email, userId, language });
    },
    sendResetPasswordMail: async ({ email, resetPasswordToken, language }) => {
      console.log("sendResetPasswordMail", { email, resetPasswordToken, language });
    },
    sendNotificationMail: async ({ notification }) => {
      console.log("sendNotificationMail", { notification });
    },
  };
};

export const getEmailClient = createSingletonGetter(createEmailClient);
