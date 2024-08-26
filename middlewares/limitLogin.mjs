import { rateLimit } from 'express-rate-limit'


export const limiter = rateLimit({
    skip: (req, res) => req.isLoggedIn,
    windowMs: 60 * 1000,
    limit: 5,
    handler: (req, res) => {
        res.status(429).send({
            message: 'Too many wrong attempts, please try again after a minute.'
        });
    }
})
