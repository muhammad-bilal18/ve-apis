
import config from 'config';
import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    const token = req.header('x-auth-token');
    console.log(token);
    if(!token) return res.status(401).send({message: 'Access denied'});

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex) {
        return res.status(400).send({message: 'Invalid token'});
    }
}