import type { Request, Response, NextFunction } from "express";

export const languageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const supportedLanguages = ["pl", "eng"];
  const urlParts = req.url.split("/").filter(Boolean);

  if (urlParts.length === 0 || !supportedLanguages.includes(urlParts[0])) {
    const defaultLanguage = "pl";
    res.redirect(`/${defaultLanguage}${req.url}`);
  }

  const language = urlParts[0];

  req.i18n.changeLanguage(language);
  req.url = req.url.replace(`/${language}`, "");
  res.locals.t = req.t;
  res.locals.language = req.i18n.language;

  console.log(`Language set to: ${req.i18n.language}`);
  next();
};
