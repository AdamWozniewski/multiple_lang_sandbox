var __awaiter =
  (this && this.__awaiter) ||
  ((thisArg, _arguments, P, generator) => {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P((resolve) => {
            resolve(value);
          });
    }
    return new (P || (P = Promise))((resolve, reject) => {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
var __generator =
  (this && this.__generator) ||
  ((thisArg, body) => {
    var _ = {
        label: 0,
        sent: () => {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return (v) => step([n, v]);
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  });
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesController = void 0;
var fs_1 = require("fs");
var json2csv_1 = require("json2csv");
var company_js_1 = require("@mongo/models/company.js");
var dirname_js_1 = require("../../services/dirname.js");
var logger_js_1 = require("../../services/logger.js");
var CompaniesController = /** @class */ (() => {
  function CompaniesController() {}
  CompaniesController.prototype.showCompany = (req, res) => {
    res.render("pages/companies/company", {
      name: req.params.name,
      title: "Kompanie",
    });
  };
  CompaniesController.prototype.showCompanies = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var _a,
        query,
        sort,
        countmin,
        countmax,
        page,
        currentPage,
        perPage,
        where,
        q,
        resultsCount,
        pagesCount,
        s,
        companies;
      var _b;
      return __generator(this, (_c) => {
        switch (_c.label) {
          case 0:
            (_a = req.query),
              (query = _a.query),
              (sort = _a.sort),
              (countmin = _a.countmin),
              (countmax = _a.countmax),
              (page = _a.page);
            currentPage = Number.parseInt(page, 10) || 1;
            perPage = 2;
            where = {};
            // Wyszukiwanie
            if (query) {
              where.name = {
                $regex: query || "",
                $options: "i", // nie zwracaj uwagi na rozmiar liter
              };
            }
            // Filtrowanie
            if (countmin || countmax) {
              where.employeesCount = {};
              if (countmin) {
                where.employeesCount.$gte = countmin;
              }
              if (countmax) {
                where.employeesCount.$lte = countmax;
              }
            }
            q = company_js_1.Company.find(where);
            return [4 /*yield*/, company_js_1.Company.countDocuments(where)];
          case 1:
            resultsCount = _c.sent();
            pagesCount = Math.ceil(resultsCount / perPage);
            // Paginacja
            q = q.skip((currentPage - 1) * perPage);
            q = q.limit(perPage);
            // Sortowanie
            // if (sort && typeof sort === "string") {
            //     const s = sort.split('|');
            //     q = q.sort({
            //         [s[0]]: s[1]
            //     });
            // }
            if (sort && typeof sort === "string") {
              s = sort.split("|");
              if (s.length === 2 && (s[1] === "asc" || s[1] === "desc")) {
                q = q.sort(((_b = {}), (_b[s[0]] = s[1]), _b));
              } else {
                console.warn("Nieprawidłowa wartość sortowania:", s[1]);
              }
            }
            return [4 /*yield*/, q.populate("user").exec()];
          case 2:
            companies = _c.sent();
            res.render("pages/companies/companies", {
              companies: companies,
              currentPage: currentPage,
              resultsCount: resultsCount,
              pagesCount: pagesCount,
            });
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesController.prototype.showCreateCompany = (_req, res) => {
    res.render("pages/companies/create-company");
  };
  CompaniesController.prototype.createCompany = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, name, slug, employeesCount, newCompany, error_1;
      return __generator(this, (_b) => {
        switch (_b.label) {
          case 0:
            (_a = req.body),
              (name = _a.name),
              (slug = _a.slug),
              (employeesCount = _a.employeesCount);
            newCompany = new company_js_1.Company({
              name: name,
              slug: slug,
              employeesCount: employeesCount,
              user: req.session.user._id,
            });
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4 /*yield*/, newCompany.save()];
          case 2:
            _b.sent();
            logger_js_1.logger.info("createCompany", {
              userId: req.session.userId,
            });
            res.redirect("/company");
            return [3 /*break*/, 4];
          case 3:
            error_1 = _b.sent();
            logger_js_1.logger.error("Error createCompany", {
              userId: req.session.userId,
              stack: error_1.stack,
            });
            res.render("pages/companies/create-company", {
              errors: error_1.errors,
              form: req.body,
            });
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesController.prototype.showEditCompany = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var name, company;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            name = req.params.name;
            return [
              4 /*yield*/,
              company_js_1.Company.findOne({
                slug: name,
              }),
            ];
          case 1:
            company = _a.sent();
            res.render("pages/companies/edit-company", {
              form: company,
            });
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesController.prototype.editCompany = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var name, company, error_2;
      var _a, _b;
      return __generator(this, (_c) => {
        switch (_c.label) {
          case 0:
            name = req.params.name;
            return [
              4 /*yield*/,
              company_js_1.Company.findOne({
                slug: name,
              }),
            ];
          case 1:
            company = _c.sent();
            company.name = req.body.name;
            company.slug = req.body.slug;
            company.employeesCount = req.body.employeesCount;
            if (
              !(
                ((_a = req.file) === null || _a === void 0
                  ? void 0
                  : _a.filename) && company.image
              )
            )
              return [3 /*break*/, 3];
            return [
              4 /*yield*/,
              fs_1.default.unlink(
                ""
                  .concat(
                    (0, dirname_js_1.__dirname)(import.meta.url),
                    "/../../public/img/uploads/",
                  )
                  .concat(company.image),
                () => {},
              ),
            ];
          case 2:
            _c.sent();
            _c.label = 3;
          case 3:
            if (
              (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename
            ) {
              company.image = req.file.filename;
            }
            _c.label = 4;
          case 4:
            _c.trys.push([4, 6, , 7]);
            return [4 /*yield*/, company.save()];
          case 5:
            _c.sent();
            logger_js_1.logger.info("editCompany", {
              userId: req.session.userId,
              ip: req.body.ip,
            });
            res.redirect("/company");
            return [3 /*break*/, 7];
          case 6:
            error_2 = _c.sent();
            logger_js_1.logger.error("Error editCompany", {
              userId: req.session.userId,
              ip: req.body.ip,
              stack: error_2.stack,
            });
            res.render("pages/companies/edit-company", {
              errors: error_2.errors,
              form: req.body,
            });
            return [3 /*break*/, 7];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesController.prototype.deleteCompany = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var name, company, error_3;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            name = req.params.name;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [4 /*yield*/, company_js_1.Company.findOne({ slug: name })];
          case 2:
            company = _a.sent();
            if (company.image) {
              try {
                fs_1.default.unlinkSync(
                  ""
                    .concat(
                      (0, dirname_js_1.__dirname)(import.meta.url),
                      "/public/img/",
                    )
                    .concat(company.image),
                );
                logger_js_1.logger.info("deleteCompany - delete image", {
                  userId: req.session.userId,
                  ip: req.body.ip,
                });
              } catch (error) {
                logger_js_1.logger.error("Error deleteCompany - delete image", {
                  userId: req.session.userId,
                  ip: req.body.ip,
                  stack: error.stack,
                });
              }
            }
            return [
              4 /*yield*/,
              company_js_1.Company.deleteOne({ slug: name }),
            ];
          case 3:
            _a.sent();
            logger_js_1.logger.info("deleteCompany", {
              userId: req.session.userId,
              ip: req.body.ip,
            });
            res.redirect("/company");
            return [3 /*break*/, 5];
          case 4:
            error_3 = _a.sent();
            logger_js_1.logger.error("Error deleteCompany", {
              userId: req.session.userId,
              ip: req.body.ip,
              stack: error_3.stack,
            });
            res.render("pages/companies", { errors: error_3.errors });
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesController.prototype.deleteImg = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var name, company, error_4;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            name = req.params.name;
            return [4 /*yield*/, company_js_1.Company.findOne({ slug: name })];
          case 1:
            company = _a.sent();
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 5]);
            return [
              4 /*yield*/,
              fs_1.default.unlink(
                ""
                  .concat(
                    (0, dirname_js_1.__dirname)(import.meta.url),
                    "/public/img/uploads/",
                  )
                  .concat(company.image),
                () => {
                  console.log("ok");
                },
              ),
            ];
          case 3:
            _a.sent();
            company.image = "";
            company.save();
            logger_js_1.logger.info("deleteImg", {
              userId: req.session.userId,
              ip: req.body.ip,
            });
            res.redirect("/company");
            return [3 /*break*/, 5];
          case 4:
            error_4 = _a.sent();
            logger_js_1.logger.error("Error deleteImg", {
              userId: req.session.userId,
              ip: req.body.ip,
              stack: error_4.stack,
            });
            res.render("pages/companies/edit-company", {
              errors:
                error_4 === null || error_4 === void 0
                  ? void 0
                  : error_4.errors,
            });
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesController.prototype.getCSV = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var fields, data, fileName, json2csv, csv;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            fields = [
              {
                label: "Nazwa",
                value: "name",
              },
              {
                label: "URL",
                value: "slug",
              },
              {
                label: "Liczba pracowników",
                value: "employeesCount",
              },
            ];
            return [4 /*yield*/, company_js_1.Company.find()];
          case 1:
            data = _a.sent();
            fileName = "companies.csv";
            json2csv = new json2csv_1.Parser({ fields: fields });
            try {
              csv = json2csv.parse(data);
              res.header("Content-Type", "text/csv");
              res.header(
                "Content-Disposition",
                'attachment; filename="'.concat(fileName, '"'),
              );
              logger_js_1.logger.info("getCSV", {
                userId: req.session.userId,
                ip: req.body.ip,
              });
              res.send(csv);
            } catch (error) {
              logger_js_1.logger.error("Error getCSV", {
                userId: req.session.userId,
                ip: req.body.ip,
                stack: error.stack,
              });
              res.status(500).send("Nie udało się wygenerować pliku CSV.");
            }
            return [2 /*return*/];
        }
      });
    });
  };
  return CompaniesController;
})();
exports.CompaniesController = CompaniesController;
