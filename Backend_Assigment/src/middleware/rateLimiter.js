const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for create/update/delete operations
const writeApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // Limit each IP to 30 write requests per windowMs
    message: {
        success: false,
        message: 'Too many write requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Very strict rate limiter for account creation/sensitive operations
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per hour
    message: {
        success: false,
        message: 'Too many attempts from this IP, please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    writeApiLimiter,
    strictLimiter
};
