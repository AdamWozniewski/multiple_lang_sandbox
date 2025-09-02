import path from "node:path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { LanguageDetector } from "i18next-http-middleware";

// const localesPath = path.resolve(process.cwd(), "./src/locales/{{lng}}/translation.json");
const localesPath = path.resolve(
  process.cwd(),
  "./src/locales/{{lng}}/{{ns}}.json",
);

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "pl",
    preload: ["eng", "pl"],
    ns: ["translation"],
    backend: {
      loadPath: localesPath,
    },
    defaultNS: "translation",
    detection: {
      order: ["path", "cookie", "header"],
      caches: ["cookie"],
      lookupFromPathIndex: -1,
    },
    debug: process.env.NODE_ENV !== "production",
  });

export default i18next;
