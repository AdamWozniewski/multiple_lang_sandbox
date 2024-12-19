Object.defineProperty(exports, "__esModule", { value: true });
exports.routerApi = void 0;
var express_1 = require("express");
var company_controller_api_js_1 = require("../controllers/api/company-controller-api.js");
var uploader_js_1 = require("../services/uploader.js");
var is_auth_api_js_1 = require("../middleware/is-auth-api.js");
var user_controller_api_js_1 = require("../controllers/api/user-controller-api.js");
var routerApi = (0, express_1.Router)();
exports.routerApi = routerApi;
var companies = new company_controller_api_js_1.CompaniesControllerApi();
var user = new user_controller_api_js_1.UserControllerApi();
routerApi.get("/companies", companies.showCompanies);
routerApi.post(
  "/companies",
  is_auth_api_js_1.isAuthMiddleware,
  companies.createCompany,
);
routerApi.put(
  "/companies/:slug",
  is_auth_api_js_1.isAuthMiddleware,
  uploader_js_1.upload.single("image"),
  companies.editCompany,
);
routerApi.delete(
  "/companies/:slug",
  is_auth_api_js_1.isAuthMiddleware,
  companies.deleteCompany,
);
routerApi.post("/login", user.loginUser);
