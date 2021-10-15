import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import frTrans from "./fr";
import enTrans from "./en";

// the translations
const resources = {
    en: {
        translation: enTrans
    },
    fr: {
        translation: frTrans
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en",

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });
