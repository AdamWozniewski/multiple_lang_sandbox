import { Router } from "express";
import {CompaniesController} from "../controllers/company-controller.js";
import {PageController} from "../controllers/page-controller.js";
import {UserController} from "../controllers/user-controller.js";
import {isAuthMiddleware} from "../middleware/is-auth-middleware.js";
import {upload} from "../services/uploader.js";

const router = new Router();

const page = new PageController()
const company = new CompaniesController()
const user = new UserController()

router.get('/', page.home);

router.get('/company/:name', company.showCompany);
router.get('/company', company.showCompanies);

router.get('/admin/company/add', isAuthMiddleware, company.showCreateCompany);
router.post('/admin/company/add', isAuthMiddleware, company.createCompany);

router.get('/admin/company/:name/edit', isAuthMiddleware, company.showEditCompany);
router.post('/admin/company/:name/edit', isAuthMiddleware, upload.single('image'), company.editCompany);
router.get('/admin/company/:name/delete', isAuthMiddleware,  company.deleteCompany);
router.get('/admin/company/:name/delete-img', isAuthMiddleware,  company.deleteImg);

router.get('/admin/profile', isAuthMiddleware,  user.showProfile);
router.post('/admin/profile', isAuthMiddleware,  user.saveProfile);


router.get('/register', user.register);
router.post('/register', user.registerUser);

router.get('/login', user.showLogin);
router.post('/login', user.loginUser);
router.post('/logout', user.logout);
router.get('/csv', company.getCSV);

router.get('*', page.notFound);


export {
    router,
}
