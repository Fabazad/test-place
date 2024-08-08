import { configs } from "@/configs.js";
import { CustomResponse } from "@/utils/CustomResponse.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import axios from "axios";
import { EmailClient } from "./type.js";

const createEmailClient = (): EmailClient => {
  const brevoAxios = axios.create({
    baseURL: configs.BREVO_BASE_URL,
    headers: {
      "api-key": configs.BREVO_API_KEY,
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  const sendTransactionalEmail = async (params: {
    from: { name?: string; email: string };
    to: { name?: string; email: string };
    subject: string;
    templateId: string;
    templateParams: Record<string, any>;
  }): Promise<CustomResponse<string, "email_not_sent">> => {
    const { from, to, subject, templateId, templateParams } = params;
    try {
      const res = await brevoAxios.post<{ messageId: string }>("/smtp/email", {
        subject,
        sender: from,
        to: [to],
        templateId,
        params: templateParams,
      });

      return { success: true, data: res.data.messageId };
    } catch (err: unknown) {
      if (axios.isAxiosError<{ code: string; message: string }>(err) && err.response) {
        const { code, message } = err.response.data;
        return {
          success: false,
          errorCode: "email_not_sent",
          errorMessage: `[${code}]: ${message}`,
        };
      }
      return {
        success: false,
        errorCode: "email_not_sent",
        errorMessage: err?.toString(),
      };
    }
  };

  return {
    sendContactUsMail: async ({ email, name, language, message }) => {
      const res = await sendTransactionalEmail({
        from: {
          name,
          email,
        },
        to: {
          name: configs.EMAIL_SENDER_NAME,
          email: configs.EMAIL_SENDER_EMAIL,
        },
        subject: "Contact us from " + name,
        templateId: "contact-us",
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
