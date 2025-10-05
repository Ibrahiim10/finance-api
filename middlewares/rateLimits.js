import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 mins
    max: 3, // max 100 requests per IP per 15 mins
    message: 'Too many requests. Please try again later.'
});
