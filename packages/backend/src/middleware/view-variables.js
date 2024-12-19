Object.defineProperty(exports, "__esModule", { value: true });
exports.globalMiddleware = void 0;
var globalMiddleware = (req, res, next) => {
  res.locals.url = req.url;
  res.locals.errors = null;
  res.locals.form = {};
  res.locals.query = req.query;
  next();
};
exports.globalMiddleware = globalMiddleware;
