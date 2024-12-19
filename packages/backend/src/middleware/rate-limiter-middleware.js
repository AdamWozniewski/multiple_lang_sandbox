Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterMiddleware = void 0;
var rate_limiter_flexible_1 = require("rate-limiter-flexible");
var rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
  points: 1000,
  duration: 1,
});
var rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req === null || req === void 0 ? void 0 : req.ip)
    .then(() => next())
    .catch(() => res.status(429).send("Too many reqs"));
};
exports.rateLimiterMiddleware = rateLimiterMiddleware;
