import { configs } from "@/configs.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import axios from "axios";
import { sendTransactionalEmail } from "./sendTransactionalEmail.js";
import { TEMPLATE_IDS } from "./templateIds.js";
import { EmailClient, EmailTemplate } from "./type.js";

const createEmailClient = (): EmailClient => {
  const brevoAxios = axios.create({
    baseURL: configs.BREVO_BASE_URL,
    headers: {
      "api-key": configs.BREVO_API_KEY,
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  return {
    sendContactUsMail: async ({ email, name, language, message }) => {
      const res = await sendTransactionalEmail({
        brevoAxios,
        from: {
          name,
          email,
        },
        to: {
          name: configs.EMAIL_SENDER_NAME,
          email: configs.EMAIL_SENDER_EMAIL,
        },
        subject: "Contact us from " + name,
        templateId: TEMPLATE_IDS[EmailTemplate.CONTACT_US][language],
        templateParams: { name, message },
      });

      return res;
    },
    sendValidateMailAddressMail: async ({ email, userId, language, userName }) => {
      console.log("sendValidateMailAddressMail", { email, userId, language, userName });
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
