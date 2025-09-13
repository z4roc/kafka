import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import deCommon from "./locales/de/common.json";

i18n.use(initReactI18next).init({
  lng: "de",              
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  ns: ["common"],          
  defaultNS: "common",
  resources: {
    en: { common: enCommon },
    de: { common: deCommon },
  },
});

export default i18n;