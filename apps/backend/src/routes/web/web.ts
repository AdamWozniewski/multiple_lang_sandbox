import { upload } from "@utility/uploader";
import { Router } from "express";
import { CompaniesController } from "../../controllers/web/company-controller";
import { PageController } from "../../controllers/web/page-controller";
import { UserController } from "../../controllers/web/user-controller";
import { isAuthMiddleware } from "../../middleware/is-auth-middleware";
import { notIsAuthMiddleware } from "../../middleware/not-is-auth-middleware";

// import { rolesMiddleware } from '../middleware/roles-middleware.js';

const routerWeb = Router();

const page = new PageController();
const company = new CompaniesController();
const user = new UserController();

routerWeb.get("/", page.home);
routerWeb.get("/companies", company.showCompanies);

routerWeb.get("/company/add", isAuthMiddleware, company.showCreateCompany);
routerWeb.post("/company/add", isAuthMiddleware, company.createCompany);

routerWeb.get("/company/:slug", company.showCompany);

routerWeb.get("/company/:name/edit", isAuthMiddleware, company.showEditCompany);
routerWeb.post(
  "/company/:name/edit",
  isAuthMiddleware,
  upload.single("image"),
  company.editCompany,
);
routerWeb.get("/company/:name/delete", isAuthMiddleware, company.deleteCompany);
routerWeb.get("/company/:name/delete-img", isAuthMiddleware, company.deleteImg);

routerWeb.get("/profile", isAuthMiddleware, user.showProfile);
routerWeb.post("/profile", isAuthMiddleware, user.saveProfile);

routerWeb.get("/register", user.register);
routerWeb.post("/register", user.registerUser);

routerWeb.get("/login", notIsAuthMiddleware, user.showLogin);
routerWeb.post("/login", user.loginUser);

// 2FA
routerWeb.get(
  "/verification/verification-code",
  notIsAuthMiddleware,
  user.verificationCode,
);
routerWeb.post("/verification/verification-code", user.verificationCodeLogin);

// QR-CODE
routerWeb.get(
  "/verification/qr-code",
  notIsAuthMiddleware,
  user.qrVerification,
);
routerWeb.get("/m/qr", user.qrMobileFakePage);
routerWeb.get("/verification/qr-code/stream/:attemptId", user.qrStream);
routerWeb.post("/verification/qr-code/pair", user.qrMobilePair);
routerWeb.post("/verification/qr-code/approve", user.qrMobileApprove);
routerWeb.post("/verification/qr-code/finalize", user.qrFinalize);

// MAGIC-LINK
routerWeb.get("/verification/magic-link", user.magicLinkPage);
routerWeb.post("/verification/magic-link", user.magicLinkSendEmail);
routerWeb.get(
  "/verification/magic-link/verification",
  user.magicLingVerification,
);

// LOGOUT
routerWeb.get("/logout", user.logout);

// FORGOT PSWD
routerWeb.get("/forgot-password", notIsAuthMiddleware, user.showForgotPassword);
routerWeb.post("/forgot-password", notIsAuthMiddleware, user.forgotPassword);

routerWeb.get(
  "/reset-forgot-password",
  notIsAuthMiddleware,
  user.showResetForgotPassword,
);
routerWeb.post(
  "/reset-forgot-password",
  notIsAuthMiddleware,
  user.resetForgotPassword,
);

routerWeb.get("/activate", user.activateUser);
routerWeb.get("/resend-activate", user.showResendActivate);
routerWeb.post("/resend-activate", user.resendActivate);

routerWeb.get("/csv", company.getCSV);
//
routerWeb.get("/{*splat}", page.notFound);

export { routerWeb };
