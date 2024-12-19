Object.defineProperty(exports, "__esModule", { value: true });
exports.routerWeb = void 0;
var express_1 = require("express");
var company_controller_js_1 = require("../controllers/web/company-controller.js");
var page_controller_js_1 = require("../controllers/web/page-controller.js");
var user_controller_js_1 = require("../controllers/web/user-controller.js");
var is_auth_middleware_js_1 = require("../middleware/is-auth-middleware.js");
var uploader_js_1 = require("../services/uploader.js");
var config_js_1 = require("../config.js");
var routerWeb = (0, express_1.Router)();
exports.routerWeb = routerWeb;
var page = new page_controller_js_1.PageController();
var company = new company_controller_js_1.CompaniesController();
var user = new user_controller_js_1.UserController();
routerWeb.get("/", page.home);
if (config_js_1.config.env === "development") {
  routerWeb.get("/test-mailing", page.test__emailPage);
  routerWeb.post("/test-mailing", page.test__sendEmail);
}
routerWeb.get("/courses/:name", company.showCompany);
routerWeb.get("/courses", company.showCompanies);
routerWeb.get(
  "/admin/company/add",
  is_auth_middleware_js_1.isAuthMiddleware,
  company.showCreateCompany,
);
routerWeb.post(
  "/admin/company/add",
  is_auth_middleware_js_1.isAuthMiddleware,
  company.createCompany,
);
routerWeb.get(
  "/admin/company/:name/edit",
  is_auth_middleware_js_1.isAuthMiddleware,
  company.showEditCompany,
);
routerWeb.post(
  "/admin/company/:name/edit",
  is_auth_middleware_js_1.isAuthMiddleware,
  uploader_js_1.upload.single("image"),
  company.editCompany,
);
routerWeb.get(
  "/admin/company/:name/delete",
  is_auth_middleware_js_1.isAuthMiddleware,
  company.deleteCompany,
);
routerWeb.get(
  "/admin/company/:name/delete-img",
  is_auth_middleware_js_1.isAuthMiddleware,
  company.deleteImg,
);
routerWeb.get(
  "/admin/profile",
  is_auth_middleware_js_1.isAuthMiddleware,
  user.showProfile,
);
routerWeb.post(
  "/admin/profile",
  is_auth_middleware_js_1.isAuthMiddleware,
  user.saveProfile,
);
routerWeb.get("/register", user.register);
routerWeb.post("/register", user.registerUser);
routerWeb.get("/login", user.showLogin);
routerWeb.post("/login", user.loginUser);
routerWeb.post("/logout", user.logout);
routerWeb.get("/csv", company.getCSV);
routerWeb.get("*", page.notFound);
