import { Notification } from "@/entities/Notification/notification.entity.js";
import { CustomResponse } from "@/utils/CustomResponse.js";
import { Language } from "@/utils/Language.js";

export type EmailClient = {
  sendContactUsMail: (params: {
    name: string;
    email: string;
    language: Language;
    message: string;
  }) => Promise<CustomResponse<string, "email_not_sent">>;
  sendEmailValidationMail: (params: {
    email: string;
    userId: string;
    userName: string;
    language: Language;
    frontendUrl: string;
  }) => Promise<CustomResponse<string, "email_not_sent">>;
  sendForgottenPasswordMail: (params: {
    email: string;
    resetPasswordToken: string;
    language: Language;
    frontendUrl: string;
  }) => Promise<CustomResponse<string, "email_not_sent">>;
  sendNotificationMail: (params: { notification: Notification }) => Promise<void>;
};

export enum EmailTemplate {
  CONTACT_US = "contact-us",
  EMAIL_VALIDATION = "email-validation",
  FORGOTTEN_PASSWORD = "forgotten-password",
  NOTIFICATION = "notification",
}
