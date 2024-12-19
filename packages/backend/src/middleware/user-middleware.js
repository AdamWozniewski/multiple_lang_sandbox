Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
var userMiddleware = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};
exports.userMiddleware = userMiddleware;
