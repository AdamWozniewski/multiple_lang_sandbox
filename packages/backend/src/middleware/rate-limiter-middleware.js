import {RateLimiterMemory} from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
    points: 1000, // ile requestów
    duration: 1, // ile sekund
});

export const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip).then(() => {
        next()
    }).catch(() => {
        res.status(429).send('Too many reqs')
    })
}