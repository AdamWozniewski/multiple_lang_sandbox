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
exports.mailer = void 0;
var nodemailer_1 = require("nodemailer");
var ejs_1 = require("ejs");
var config_js_1 = require("../config.js");
var dirname_js_1 = require("./dirname.js");
var mailer = (email, subject, content) =>
  __awaiter(void 0, void 0, void 0, function () {
    var testAccount, transporter;
    return __generator(this, (_a) => {
      switch (_a.label) {
        case 0:
          console.log(email);
          return [4 /*yield*/, (0, nodemailer_1.createTestAccount)()];
        case 1:
          testAccount = _a.sent();
          transporter = (0, nodemailer_1.createTransport)({
            host: config_js_1.config.emailHost,
            // host: "smtp.ethereal.email",
            port: Number.parseInt(config_js_1.config.emailPort, 10),
            // port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          return [
            4 /*yield*/,
            (0, ejs_1.renderFile)(
              "".concat(
                (0, dirname_js_1.__dirname)(import.meta.url),
                "/../views/pages/mailing/subscribe.ejs",
              ),
              { content: content },
              (err, data) =>
                __awaiter(void 0, void 0, void 0, function () {
                  var info;
                  return __generator(this, (_a) => {
                    switch (_a.label) {
                      case 0:
                        if (!err) return [3 /*break*/, 1];
                        console.log(err);
                        return [3 /*break*/, 3];
                      case 1:
                        return [
                          4 /*yield*/,
                          transporter.sendMail({
                            from: "adam.test@test.test",
                            to: email,
                            subject: subject,
                            text: "Dzięki za zapis",
                            html: data,
                          }),
                        ];
                      case 2:
                        info = _a.sent();
                        console.log((0, nodemailer_1.getTestMessageUrl)(info));
                        _a.label = 3;
                      case 3:
                        return [2 /*return*/];
                    }
                  });
                }),
            ),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
exports.mailer = mailer;
