import { configs } from "../../configs.js";
import { Language } from "../../utils/Language.js";
import { EmailTemplate } from "./type.js";
export const TEMPLATE_IDS = {
    [EmailTemplate.CONTACT_US]: {
        [Language.FR]: configs.CONTACT_US_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.CONTACT_US_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.CONTACT_US_EMAIL_TEMPLATE_ID_CH,
    },
    [EmailTemplate.EMAIL_VALIDATION]: {
        [Language.FR]: configs.EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_CH,
    },
    [EmailTemplate.FORGOTTEN_PASSWORD]: {
        [Language.FR]: configs.FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_CH,
    },
    [EmailTemplate.NOTIFICATION]: {
        [Language.FR]: configs.NOTIFICATION_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.NOTIFICATION_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.NOTIFICATION_EMAIL_TEMPLATE_ID_CH,
    },
};
