import { configs } from "../../configs.js";
import { createSingletonGetter } from "../../utils/singleton.js";
import axios from "axios";
import path from "path";
import { sendTransactionalEmail } from "./sendTransactionalEmail.js";
import { TEMPLATE_IDS } from "./templateIds.js";
import { EmailTemplate } from "./type.js";
const createEmailClient = () => {
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
                subject: "Contact us from " + name,
                templateId: TEMPLATE_IDS[EmailTemplate.CONTACT_US][language],
                templateParams: { name, message },
            });
            return res;
        },
        sendEmailValidationMail: async ({ email, userId, language, userName, frontendUrl, }) => {
            const emailValidationLink = path.join(frontendUrl, "email-validation", userId);
            const res = await sendTransactionalEmail({
                brevoAxios,
                from: fromTestPlace,
                to: {
                    name: userName,
                    email,
                },
                subject: "Test Place - Email validation",
                templateId: TEMPLATE_IDS[EmailTemplate.EMAIL_VALIDATION][language],
                templateParams: { link: emailValidationLink, userName },
            });
            return res;
        },
        sendForgottenPasswordMail: async ({ email, resetPasswordToken, language, frontendUrl, }) => {
            const resetPasswordLink = path.join(frontendUrl, "reset-password", resetPasswordToken);
            const res = await sendTransactionalEmail({
                brevoAxios,
                from: fromTestPlace,
                to: { email },
                subject: "Test Place - Forgotten password",
                templateId: TEMPLATE_IDS[EmailTemplate.FORGOTTEN_PASSWORD][language],
                templateParams: { link: resetPasswordLink },
            });
            return res;
        },
        sendNotificationMail: async ({ notification }) => {
            const res = await sendTransactionalEmail({
                brevoAxios,
                from: fromTestPlace,
                to: { email: notification.user.email },
                subject: "Test Place - Notification",
                templateId: TEMPLATE_IDS[EmailTemplate.NOTIFICATION][notification.user.language],
                templateParams: notification,
            });
            return res;
        },
    };
};
export const getEmailClient = createSingletonGetter(createEmailClient);
