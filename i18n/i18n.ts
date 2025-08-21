import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import deCommon from "../i18n/locales/de/common.json";
import enCommon from "../i18n/locales/en/common.json";

const formatters: Record<string, Intl.DateTimeFormatOptions> = {
  date: { year: "numeric", month: "long", day: "numeric" }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "de"],
    ns: ["common"],
    defaultNS: "common",
    resources: {
        de : { common: deCommon},
        en : { common: enCommon}
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lng",
      caches: ["localStorage"]
    },
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (value instanceof Date && format) {
          return new Intl.DateTimeFormat(lng, formatters[format] || {}).format(value);
        }
        return String(value);
      }
    },
    load: "currentOnly",
    react: { useSuspense: true }
  });

export default i18n;