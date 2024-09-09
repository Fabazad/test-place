
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="fc7ce961-2a2c-547b-adb3-44cb45b10c9f")}catch(e){}}();
import { configs } from "../../configs.js";
import { Role } from "../../utils/constants.js";
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
                templateId: TEMPLATE_IDS[EmailTemplate.FORGOTTEN_PASSWORD][language],
                templateParams: { link: resetPasswordLink },
            });
            return res;
        },
        sendNotificationMail: async ({ notification, to, frontendUrl, userRole }) => {
            const testLink = path.join(frontendUrl, "dashboard", `${userRole === Role.TESTER ? "my-current-tests" : "customer-current-tests"}?testId=${notification.test._id}`);
            const res = await sendTransactionalEmail({
                brevoAxios,
                from: fromTestPlace,
                to,
                templateId: TEMPLATE_IDS[EmailTemplate.NOTIFICATION][to.language],
                templateParams: {
                    testStatus: notification.test.status,
                    productTitle: notification.product.title,
                    testLink,
                    productImageUrl: notification.product.imageUrls[0],
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
  templateParams: { title, message, testLink, productImageUrl }
*/
//# sourceMappingURL=index.js.map
//# debugId=fc7ce961-2a2c-547b-adb3-44cb45b10c9f
