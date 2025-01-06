import type { Request, Response, NextFunction } from "express";

export const languageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const supportedLanguages = ["pl", "eng"];
  const language = req.url.split("/")[1];

  if (!language) {
    const defaultLanguage = "pl";
    return res.redirect(`/${defaultLanguage}${req.url}`);
  }

  if (supportedLanguages.includes(language)) {
    req.i18n.changeLanguage(language);
    req.url = req.url.replace(`/${language}`, "");

    res.locals.t = req.t;
    res.locals.language = req.i18n.language;

    console.log(`Language set to: ${req.i18n.language}`);
    next();
  } else {
    res.status(404).send("Language not supported");
  }
};
