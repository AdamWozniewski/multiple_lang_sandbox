import {Router} from "express";
import {CompaniesController} from "../controllers/web/company-controller.js";
import {PageController} from "../controllers/web/page-controller.js";
import {UserController} from "../controllers/web/user-controller.js";
import {isAuthMiddleware} from "../middleware/is-auth-middleware.js";
import {upload} from "../services/uploader.js";

const routerWeb = new Router();

const page = new PageController()
const company = new CompaniesController()
const user = new UserController()

routerWeb.get('/', page.home);

routerWeb.get('/courses/:name', company.showCompany);
routerWeb.get('/courses', company.showCompanies);

routerWeb.get('/admin/company/add', isAuthMiddleware, company.showCreateCompany);
routerWeb.post('/admin/company/add', isAuthMiddleware, company.createCompany);

routerWeb.get('/admin/company/:name/edit', isAuthMiddleware, company.showEditCompany);
routerWeb.post('/admin/company/:name/edit', isAuthMiddleware, upload.single('image'), company.editCompany);
routerWeb.get('/admin/company/:name/delete', isAuthMiddleware,  company.deleteCompany);
routerWeb.get('/admin/company/:name/delete-img', isAuthMiddleware,  company.deleteImg);

routerWeb.get('/admin/profile', isAuthMiddleware,  user.showProfile);
routerWeb.post('/admin/profile', isAuthMiddleware,  user.saveProfile);


routerWeb.get('/register', user.register);
routerWeb.post('/register', user.registerUser);

routerWeb.get('/login', user.showLogin);
routerWeb.post('/login', user.loginUser);
routerWeb.post('/logout', user.logout);
routerWeb.get('/csv', company.getCSV);

routerWeb.get('*', page.notFound);


export {
    routerWeb,
}
