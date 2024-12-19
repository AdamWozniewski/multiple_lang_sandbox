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
// import { runDBAdmin } from "./db/sql/init.ts";
var express_1 = require("express");
var path_1 = require("path");
var express_ejs_layouts_1 = require("express-ejs-layouts");
// import './db/mongo/database.ts';
var web_js_1 = require("./routes/web.js");
var api_js_1 = require("./routes/api.js");
var view_variables_js_1 = require("./middleware/view-variables.js");
var cookie_parser_1 = require("cookie-parser");
var express_session_1 = require("express-session");
var user_middleware_js_1 = require("./middleware/user-middleware.js");
var is_auth_middleware_js_1 = require("./middleware/is-auth-middleware.js");
var rate_limiter_middleware_js_1 = require("./middleware/rate-limiter-middleware.js");
var config_js_1 = require("./config.js");
var swagger_ui_express_1 = require("swagger-ui-express");
var promises_1 = require("fs/promises");
var dirname_js_1 = require("./services/dirname.js");
var startApp = () =>
  __awaiter(void 0, void 0, void 0, function () {
    var app, swaggerDocument, _a, _b;
    return __generator(this, (_c) => {
      switch (_c.label) {
        case 0:
          app = (0, express_1.default)();
          app.use(
            (0, express_session_1.default)({
              secret: config_js_1.config.secretSession,
              saveUninitialized: true,
              cookie: {
                maxAge: 86400000,
              },
              resave: false,
            }),
          );
          _b = (_a = JSON).parse;
          return [
            4 /*yield*/,
            (0, promises_1.readFile)(
              new URL("./../docs/swagger.json", import.meta.url),
            ),
          ];
        case 1:
          swaggerDocument = _b.apply(_a, [_c.sent()]);
          app.use(
            "/api-docs",
            swagger_ui_express_1.serve,
            (0, swagger_ui_express_1.setup)(swaggerDocument),
          );
          app.disable("etag");
          app.set("view engine", "ejs");
          app.use(express_ejs_layouts_1.default);
          app.set(
            "views",
            path_1.default.join(
              (0, dirname_js_1.__dirname)(import.meta.url),
              "/views",
            ),
          );
          app.set("layout", "layouts/main");
          app.use(express_1.default.static("public"));
          app.use(express_1.default.urlencoded({ extended: true }));
          app.use((0, cookie_parser_1.default)());
          app.use(express_1.default.json());
          app.use(view_variables_js_1.globalMiddleware);
          app.use(user_middleware_js_1.userMiddleware);
          // app.use(helmet({
          //     directives: {
          //         defaultSrc: ["'self'"],
          //         scriptSrc: ["'self'", "cdn.jsdelivr.net"],
          //         styleSrc: ["'self'", "cdn.jsdelivr.net"],
          //     }
          // }))
          app.use(rate_limiter_middleware_js_1.rateLimiterMiddleware);
          app.use("/admin", is_auth_middleware_js_1.isAuthMiddleware);
          // Routing
          app.use("/api", api_js_1.routerApi);
          app.use(web_js_1.routerWeb);
          return [2 /*return*/, app];
      }
    });
  });
exports.default = startApp;
