
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7e78c707-dabf-5cf3-91e5-08951204ab09")}catch(e){}}();
import { configs } from "../../configs.js";
import { NotificationType, Role } from "../../utils/constants.js";
import { createSingletonGetter } from "../../utils/singleton.js";
import axios from "axios";
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
    const fromTestPlaceContact = {
        name: configs.EMAIL_SENDER_NAME,
        email: configs.EMAIL_SENDER_EMAIL,
    };
    const fromTestPlaceNoReply = {
        name: configs.EMAIL_SENDER_NAME,
        email: configs.NO_REPLY_EMAIL_SENDER_EMAIL,
    };
    return {
        sendContactUsMail: async ({ email, name, message }) => {
            const res = await sendTransactionalEmail({
                brevoAxios,
                from: { name, email },
                to: {
                    name: configs.EMAIL_SENDER_NAME,
                    email: configs.EMAIL_SENDER_EMAIL,
                },
                templateId: configs.CONTACT_US_EMAIL_TEMPLATE_ID,
                templateParams: { name, message },
            });
            return res;
        },
        sendEmailValidationMail: async ({ email, userId, language, userName, frontendUrl, }) => {
            const emailValidationLink = new URL(`email-validation/${userId}`, frontendUrl).toString();
            const templateId = TEMPLATE_IDS[EmailTemplate.EMAIL_VALIDATION][language];
            const res = await sendTransactionalEmail({
                brevoAxios,
                from: fromTestPlaceContact,
                to: { name: userName, email },
                templateId,
                templateParams: { link: emailValidationLink, userName },
            });
            return res;
        },
        sendForgottenPasswordMail: async ({ email, resetPasswordToken, language, frontendUrl, }) => {
            const resetPasswordLink = new URL(`reset-password/${resetPasswordToken}`, frontendUrl).toString();
            const res = await sendTransactionalEmail({
                brevoAxios,
                from: fromTestPlaceContact,
                to: { email },
                templateId: TEMPLATE_IDS[EmailTemplate.FORGOTTEN_PASSWORD][language],
                templateParams: { link: resetPasswordLink },
            });
            return res;
        },
        sendNotificationMail: async ({ notification, to, frontendUrl, userRole }) => {
            const testLink = new URL(`dashboard/${userRole === Role.TESTER ? "my-current-tests" : "customer-current-tests"}?testId=${notification.test._id}`, frontendUrl).toString();
            const templateMap = {
                [NotificationType.MONEY_SENT]: EmailTemplate.MONEY_SENT,
                [NotificationType.NEW_REQUEST]: EmailTemplate.NEW_TEST_REQUEST,
                [NotificationType.PRODUCT_REVIEWED]: EmailTemplate.PRODUCT_REVIEWED,
                [NotificationType.REQUEST_ACCEPTED]: EmailTemplate.TEST_REQUEST_ACCEPTED,
            };
            const defaultTemplate = EmailTemplate.NOTIFICATION;
            const templateId = TEMPLATE_IDS[templateMap[notification.type] || defaultTemplate][to.language];
            const res = await sendTransactionalEmail({
                brevoAxios,
                from: fromTestPlaceContact,
                to,
                templateId: templateId,
                templateParams: {
                    testStatus: notification.test.status,
                    productTitle: notification.product.title,
                    testLink,
                    productImageUrl: notification.product.imageUrls[0],
                    userName: to.name,
                },
            });
            return res;
        },
        sendLastPublishedProductsMail: async ({ frontendUrl, to, products }) => {
            const productsObjects = products.map((product) => ({
                title: product.title,
                imageUrl: product.imageUrls[0],
                link: new URL(`ad/${product._id}`, frontendUrl).toString(),
            }));
            const allRes = await Promise.all(to.map(async ({ email, name, language }) => {
                const templateId = TEMPLATE_IDS[EmailTemplate.LAST_PUBLISHED_PRODUCTS][language];
                const res = await sendTransactionalEmail({
                    brevoAxios,
                    from: fromTestPlaceNoReply,
                    to: { email, name },
                    templateId,
                    templateParams: { userName: name, products: productsObjects },
                });
                return res;
            }));
            return { success: true, data: allRes.filter((r) => r.success).map((r) => r.data) };
        },
    };
};
export const getEmailClient = createSingletonGetter(createEmailClient);
//# sourceMappingURL=index.js.map
//# debugId=7e78c707-dabf-5cf3-91e5-08951204ab09
