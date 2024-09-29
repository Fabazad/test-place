import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import bdTrans from "./bd";
import chTrans from "./ch";
import enTrans from "./en";
import frTrans from "./fr";
// the translations
const resources = {
  en: {
    translation: enTrans,
  },
  fr: {
    translation: frTrans,
  },
  ch: {
    translation: chTrans,
  },
  bd: {
    translation: bdTrans,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
