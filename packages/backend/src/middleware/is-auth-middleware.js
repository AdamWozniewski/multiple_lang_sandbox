Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthMiddleware = void 0;
var isAuthMiddleware = (req, res, next) => {
  if (!req.session.user) res.redirect("/");
  next();
};
exports.isAuthMiddleware = isAuthMiddleware;
