import { Router } from "express";
import { CompaniesControllerApi } from "../controllers/api/company-controller-api.js";
import { UserControllerApi } from "../controllers/api/user-controller-api.js";
import { isAuthMiddlewareJWT } from '../middleware/is-auth-api.js';
import { upload } from "@utility/uploader.js";

const routerApi = Router();

const companies = new CompaniesControllerApi();
const user = new UserControllerApi();

routerApi.get("/companies", isAuthMiddlewareJWT,companies.showCompanies);
routerApi.post("/companies", isAuthMiddlewareJWT, companies.createCompany);
routerApi.put(
  "/companies/:slug",
  isAuthMiddlewareJWT,
  upload.single("image"),
  companies.editCompany,
);
routerApi.delete("/companies/:slug", isAuthMiddlewareJWT, companies.deleteCompany);

routerApi.post("/login", user.loginUser);
routerApi.post("/logout", user.logoutUser);
routerApi.post("/refresh", user.refreshToken);
routerApi.get("/csrf-token", (_, res) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

console.log();

export { routerApi };
