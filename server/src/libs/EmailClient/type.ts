import { Notification } from "@/entities/Notification/notification.entity.js";
import { Product } from "@/entities/Product/product.entity.js";
import { Role } from "@/utils/constants.js";
import { CustomResponse } from "@/utils/CustomResponse.js";
import { Language } from "@/utils/Language.js";

export type EmailClient = {
  sendContactUsMail: (params: {
    name: string;
    email: string;
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
  sendNotificationMail: (params: {
    notification: Notification;
    to: { email: string; name: string; language: Language };
    frontendUrl: string;
    userRole: Role;
  }) => Promise<CustomResponse<string, "email_not_sent">>;
  sendLastPublishedProductsMail: (params: {
    frontendUrl: string;
    to: Array<{ email: string; name: string; language: Language }>;
    products: Array<Product>;
    productsCount: number;
  }) => Promise<CustomResponse<Array<string>>>;
};

export enum EmailTemplate {
  EMAIL_VALIDATION = "email-validation",
  FORGOTTEN_PASSWORD = "forgotten-password",
  NOTIFICATION = "notification",
  NEW_TEST_REQUEST = "new-test-request",
  TEST_REQUEST_ACCEPTED = "test-request-accepted",
  MONEY_SENT = "money-sent",
  PRODUCT_REVIEWED = "product-reviewed",
  LAST_PUBLISHED_PRODUCTS = "last-published-products",
  NEW_MESSAGE = "new-message",
}
