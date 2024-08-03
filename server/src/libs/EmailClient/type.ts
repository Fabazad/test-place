import { Notification } from "@/models/notification.model";
import { Language } from "@/utils/Language";

export type EmailClient = {
  sendContactUsMail: (params: {
    name: string;
    email: string;
    language: Language;
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
