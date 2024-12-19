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
exports.UserController = void 0;
var user_js_1 = require("@mongo/models/user.js");
var logger_js_1 = require("../../services/logger.js");
var db_js_1 = require("@sql/db.js");
var index_js_1 = require("@sql/models/index.js");
var hash_js_1 = require("../../services/hash.js");
var UserController = /** @class */ (() => {
  function UserController() {}
  UserController.prototype.register = (_req, res) => {
    res.render("pages/auth/register", {});
  };
  UserController.prototype.registerUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var password, error_1;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            password = (0, hash_js_1.hashPassword)(req.body.password);
            return [
              4 /*yield*/,
              db_js_1.db.insert(index_js_1.userTable).values({
                email: req.body.email,
                password: password,
              }),
            ];
          case 1:
            _a.sent();
            logger_js_1.logger.info("registerUser", { ip: req.body.ip });
            res.redirect("/");
            return [3 /*break*/, 3];
          case 2:
            error_1 = _a.sent();
            logger_js_1.logger.error("Error registerUser", {
              ip: req.body.ip,
              stack: error_1.stack,
            });
            console.log(error_1);
            res.render("pages/auth/register", {
              errors: {
                email: {
                  message: "ten amejl jest zajęty",
                },
              },
              form: req.body,
            });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  UserController.prototype.showLogin = (_req, res) => {
    res.render("pages/auth/login", {});
  };
  UserController.prototype.loginUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var user, isValidPassword, e_1;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4 /*yield*/,
              user_js_1.User.findOne({
                email: req.body.email,
              }),
            ];
          case 1:
            user = _a.sent();
            if (!user) {
              throw new Error("User does not exist");
            }
            isValidPassword = user.comparePassword(req.body.password);
            if (!isValidPassword) {
              throw new Error("password not valid");
            }
            req.session.user = {
              _id: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            };
            res.redirect("/");
            return [3 /*break*/, 3];
          case 2:
            e_1 = _a.sent();
            console.log(e_1);
            res.render("pages/auth/login", {
              errors: e_1.errors,
              form: req.body,
            });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  UserController.prototype.logout = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, req.session.destroy(() => {})];
          case 1:
            _a.sent();
            res.clearCookie("connect.sid");
            res.redirect("/login");
            return [2 /*return*/];
        }
      });
    });
  };
  UserController.prototype.showProfile = (req, res) => {
    res.render("pages/auth/profile", { form: req.session.user });
  };
  UserController.prototype.saveProfile = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
      var user, error_2;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, user_js_1.User.findById(req.session.user._id)];
          case 1:
            user = _a.sent();
            user.email = req.body.email;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            if (req.body.password) {
              user.password = req.body.password;
            }
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 5]);
            return [4 /*yield*/, user.save()];
          case 3:
            _a.sent();
            req.session.user = user;
            logger_js_1.logger.info("saveProfile", { ip: req.body.ip });
            res.redirect("/admin/profile"); // to oznacza: wróc skąd przyszedłeś
            return [3 /*break*/, 5];
          case 4:
            error_2 = _a.sent();
            logger_js_1.logger.error("Error saveProfile", {
              ip: req.body.ip,
              stack: error_2.stack,
            });
            res.render("pages/auth/profile", {
              errors: error_2.errors,
              form: req.body,
            });
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  return UserController;
})();
exports.UserController = UserController;
