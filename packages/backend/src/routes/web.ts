import { Router } from "express";
import { CompaniesController } from "../controllers/web/company-controller.js";
import { PageController } from "../controllers/web/page-controller.js";
import { UserController } from "../controllers/web/user-controller.js";
import { isAuthMiddleware } from "../middleware/is-auth-middleware.js";
import { upload } from "@utility/uploader.js";
import { doubleCsrfProtection } from "../middleware/csrf-middleware.js";
import { notIsAuthMiddleware } from '../middleware/not-is-auth-middleware.js';
// import { rolesMiddleware } from '../middleware/roles-middleware.js';

const routerWeb = Router();

const page = new PageController();
const company = new CompaniesController();
const user = new UserController();

routerWeb.get("/", page.home);
routerWeb.get("/company/:name", company.showCompany);
routerWeb.get("/companies", company.showCompanies);

routerWeb.get(
  "/admin/company/add",
  isAuthMiddleware,
  company.showCreateCompany,
);
routerWeb.post(
  "/admin/company/add",
  // doubleCsrfProtection,
  isAuthMiddleware,
  company.createCompany,
);

routerWeb.get(
  "/admin/company/:name/edit",
  isAuthMiddleware,
  company.showEditCompany,
);
routerWeb.post(
  "/admin/company/:name/edit",
  // doubleCsrfProtection,
  isAuthMiddleware,
  upload.single("image"),
  company.editCompany,
);
routerWeb.get(
  "/admin/company/:name/delete",
  isAuthMiddleware,
  company.deleteCompany,
);
routerWeb.get(
  "/admin/company/:name/delete-img",
  isAuthMiddleware,
  company.deleteImg,
);

routerWeb.get("/admin/profile", isAuthMiddleware, user.showProfile);
routerWeb.post("/admin/profile", isAuthMiddleware, user.saveProfile);

routerWeb.get("/register", user.register);
routerWeb.post("/register", user.registerUser);

routerWeb.get("/login", notIsAuthMiddleware, user.showLogin);
routerWeb.post("/login", user.loginUser);

routerWeb.get("/verification/verification-code", notIsAuthMiddleware, user.emailCodeVerification);
routerWeb.post("/verification/verification-code", user.emailCodeVerificationLogin);

// routerWeb.get("/verification/qr-verification", notIsAuthMiddleware, user.qrVerification);
// routerWeb.post("/verification/qr-verification", user.qrVerificationLogin);

routerWeb.get("/auth/:provider", user.loginWithProvider);
routerWeb.get("/auth/:provider/callback", user.oauthCallback);
routerWeb.get("/logout", user.logout);

routerWeb.get("/forgot-password", notIsAuthMiddleware ,user.showForgotPassword);
routerWeb.post("/forgot-password", notIsAuthMiddleware, user.forgotPassword);

routerWeb.get("/reset-forgot-password", notIsAuthMiddleware, user.showResetForgotPassword);
routerWeb.post("/reset-forgot-password", notIsAuthMiddleware, user.resetForgotPassword);

routerWeb.get("/activate", user.activateUser);

routerWeb.get("/csv", company.getCSV);
//
// routerWeb.get("/{*splat}", page.notFound);

export { routerWeb };
