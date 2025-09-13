import path from "node:path";

export default {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
  },
  localePath: path.resolve("./src/i18n/locales"),
};
