import { Notification } from "@/entities/Notification/notification.entity.js";
import { Language } from "@/utils/Language.js";

export type EmailClient = {
  sendContactUsMail: (params: {
    name: string;
    email: string;
    language: Language;
    message: string;
  }) => Promise<void>;
  sendValidateMailAddressMail: (params: {
    email: string;
    userId: string;
    language: Language;
  }) => Promise<void>;
  sendResetPasswordMail: (params: {
    email: string;
    resetPasswordToken: string;
    language: Language;
  }) => Promise<void>;
  sendNotificationMail: (params: { notification: Notification }) => Promise<void>;
};
