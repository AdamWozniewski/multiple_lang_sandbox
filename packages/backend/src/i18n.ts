import path from "node:path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { LanguageDetector } from "i18next-http-middleware";

const localesPath = path.resolve(process.cwd(), "./src/locales/{{lng}}/translation.json");

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "pl",
    backend: {
      loadPath: localesPath,
    },
    preload: ["eng", "pl"],
    detection: {
      order: ["path", "cookie", "header"],
      caches: ["cookie"],
    },
    debug: true,
  });

export default i18next;