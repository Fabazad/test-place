
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6e22bc7e-6d55-50f9-b19d-78f90394c148")}catch(e){}}();
import { configs } from "../../configs.js";
import { Language } from "../../utils/Language.js";
import { EmailTemplate } from "./type.js";
export const TEMPLATE_IDS = {
    [EmailTemplate.EMAIL_VALIDATION]: {
        [Language.FR]: configs.EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_CH,
        [Language.BD]: configs.EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_BD,
    },
    [EmailTemplate.FORGOTTEN_PASSWORD]: {
        [Language.FR]: configs.FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_CH,
        [Language.BD]: configs.FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_BD,
    },
    [EmailTemplate.NOTIFICATION]: {
        [Language.FR]: configs.NOTIFICATION_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.NOTIFICATION_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.NOTIFICATION_EMAIL_TEMPLATE_ID_CH,
        [Language.BD]: configs.NOTIFICATION_EMAIL_TEMPLATE_ID_BD,
    },
    [EmailTemplate.NEW_TEST_REQUEST]: {
        [Language.FR]: configs.NEW_TEST_REQUEST_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.NEW_TEST_REQUEST_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.NEW_TEST_REQUEST_EMAIL_TEMPLATE_ID_CH,
        [Language.BD]: configs.NEW_TEST_REQUEST_EMAIL_TEMPLATE_ID_BD,
    },
    [EmailTemplate.TEST_REQUEST_ACCEPTED]: {
        [Language.FR]: configs.TEST_REQUEST_ACCEPTED_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.TEST_REQUEST_ACCEPTED_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.TEST_REQUEST_ACCEPTED_EMAIL_TEMPLATE_ID_CH,
        [Language.BD]: configs.TEST_REQUEST_ACCEPTED_EMAIL_TEMPLATE_ID_BD,
    },
    [EmailTemplate.MONEY_SENT]: {
        [Language.FR]: configs.MONEY_SENT_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.MONEY_SENT_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.MONEY_SENT_EMAIL_TEMPLATE_ID_CH,
        [Language.BD]: configs.MONEY_SENT_EMAIL_TEMPLATE_ID_BD,
    },
    [EmailTemplate.PRODUCT_REVIEWED]: {
        [Language.FR]: configs.PRODUCT_REVIEWED_EMAIL_TEMPLATE_ID_FR,
        [Language.EN]: configs.PRODUCT_REVIEWED_EMAIL_TEMPLATE_ID_EN,
        [Language.CH]: configs.PRODUCT_REVIEWED_EMAIL_TEMPLATE_ID_CH,
        [Language.BD]: configs.PRODUCT_REVIEWED_EMAIL_TEMPLATE_ID_BD,
    },
};
//# sourceMappingURL=templateIds.js.map
//# debugId=6e22bc7e-6d55-50f9-b19d-78f90394c148
