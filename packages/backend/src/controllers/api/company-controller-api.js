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
exports.CompaniesControllerApi = void 0;
var company_js_1 = require("@mongo/models/company.js");
var fs_1 = require("fs");
var mongoose_1 = require("mongoose");
var dirname_js_1 = require("../../services/dirname.js");
var CompaniesControllerApi = /** @class */ (() => {
  function CompaniesControllerApi() {}
  CompaniesControllerApi.prototype.showCompanies = function (_req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var companies;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, company_js_1.Company.find()];
          case 1:
            companies = _a.sent();
            res.header("content-type", "application/json");
            res.json({ companies: companies });
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesControllerApi.prototype.createCompany = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, name, slug, employeesCount, newCompany, e_1;
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
              user: req.user, // od middleware
            });
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4 /*yield*/, newCompany.save()];
          case 2:
            _b.sent();
            res.status(201).json(newCompany);
            return [3 /*break*/, 4];
          case 3:
            e_1 = _b.sent();
            console.log(e_1);
            if (e_1 instanceof mongoose_1.default.Error.ValidationError) {
              res.status(422).json({ error: e_1.errors });
            } else {
              res.status(500).json({ message: "Internal server error" });
            }
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesControllerApi.prototype.editCompany = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var name, company, e_2;
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
            if (req.body.name) company.slug = req.body.name;
            if (req.body.slug) company.slug = req.body.slug;
            if (req.body.numberEmployees)
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
            res.status(200).json(company);
            return [3 /*break*/, 7];
          case 6:
            e_2 = _c.sent();
            console.log(e_2);
            if (e_2 instanceof mongoose_1.default.Error.ValidationError) {
              res.status(422).json({ error: e_2.errors });
            } else {
              res.status(500).json({ message: "Internal server error" });
            }
            return [3 /*break*/, 7];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  CompaniesControllerApi.prototype.deleteCompany = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var slug, company, e_3;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            slug = req.params.slug;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [4 /*yield*/, company_js_1.Company.findOne({ slug: slug })];
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
              } catch (e) {
                if (e instanceof mongoose_1.default.Error.ValidationError) {
                  res.status(422).json({
                    error:
                      "B\u0142\u0105d podczas usuwania pliku obrazu: ".concat(
                        e === null || e === void 0 ? void 0 : e.message,
                      ),
                  });
                } else {
                  res.status(500).json({ message: "Internal server error" });
                }
              }
            }
            return [
              4 /*yield*/,
              company_js_1.Company.deleteOne({ slug: name }),
            ];
          case 3:
            _a.sent();
            res.status(204).send();
            return [3 /*break*/, 5];
          case 4:
            e_3 = _a.sent();
            console.log(e_3);
            if (e_3 instanceof mongoose_1.default.Error.ValidationError) {
              res.status(422).json({ error: e_3.errors });
            } else {
              res.status(500).json({ message: "Internal server error" });
            }
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  return CompaniesControllerApi;
})();
exports.CompaniesControllerApi = CompaniesControllerApi;
