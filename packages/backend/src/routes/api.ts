import { Router } from "express";
import { CompaniesControllerApi } from "../controllers/api/company-controller-api.js";
import { UserControllerApi } from "../controllers/api/user-controller-api.js";
import { isAuthMiddleware } from "../middleware/is-auth-api.js";
import { upload } from "../services/uploader.js";

const routerApi = Router();

const companies = new CompaniesControllerApi();
const user = new UserControllerApi();

routerApi.get("/companies", companies.showCompanies);
routerApi.post("/companies", isAuthMiddleware, companies.createCompany);
routerApi.put(
  "/companies/:slug",
  isAuthMiddleware,
  upload.single("image"),
  companies.editCompany,
);
routerApi.delete("/companies/:slug", isAuthMiddleware, companies.deleteCompany);

routerApi.post("/login", user.loginUser);

export { routerApi };
