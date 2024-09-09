import { configs } from "@/configs.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import axios from "axios";
import path from "path";
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

  const fromTestPlace = {
    name: configs.EMAIL_SENDER_NAME,
    email: configs.EMAIL_SENDER_EMAIL,
  };

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
        templateId: TEMPLATE_IDS[EmailTemplate.CONTACT_US][language],
        templateParams: { name, message },
      });

      return res;
    },

    sendEmailValidationMail: async ({
      email,
      userId,
      language,
      userName,
      frontendUrl,
    }) => {
      const emailValidationLink = path.join(frontendUrl, "email-validation", userId);

      const res = await sendTransactionalEmail({
        brevoAxios,
        from: fromTestPlace,
        to: {
          name: userName,
          email,
        },
        templateId: TEMPLATE_IDS[EmailTemplate.EMAIL_VALIDATION][language],
        templateParams: { link: emailValidationLink, userName },
      });

      return res;
    },

    sendForgottenPasswordMail: async ({
      email,
      resetPasswordToken,
      language,
      frontendUrl,
    }) => {
      const resetPasswordLink = path.join(
        frontendUrl,
        "reset-password",
        resetPasswordToken
      );

      const res = await sendTransactionalEmail({
        brevoAxios,
        from: fromTestPlace,
        to: { email },
        templateId: TEMPLATE_IDS[EmailTemplate.FORGOTTEN_PASSWORD][language],
        templateParams: { link: resetPasswordLink },
      });

      return res;
    },
    sendNotificationMail: async ({ notification, to, frontendUrl }) => {
      const testLink = path.join(frontendUrl, "tests", notification.test._id);
      const res = await sendTransactionalEmail({
        brevoAxios,
        from: fromTestPlace,
        to,
        templateId: TEMPLATE_IDS[EmailTemplate.NOTIFICATION][to.language],
        templateParams: {
          testStatus: notification.test.status,
          productTitle: notification.product.title,
        },
      });

      return res;
    },
  };
};

export const getEmailClient = createSingletonGetter(createEmailClient);

/*
  CONTACT_US :
  templateParams: { name, message }

  EMAIL_VALIDATION :
  templateParams: { link, userName }

  FORGOTTEN_PASSWORD :
  templateParams: { link }

  NOTIFICATION :
  templateParams: { title, message, link }
*/
