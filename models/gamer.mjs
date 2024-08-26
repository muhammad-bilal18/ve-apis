import mongoose from "mongoose";
import Joi from "joi";
import jwt from 'jsonwebtoken';
import config from 'config';

const gamerSchema = new mongoose.Schema({
    userName: String,
    gameCodes: [String]
});

gamerSchema.methods.genrateToken = function() {
    const token = jwt.sign({ _id: this._id, userName: this.userName }, config.get('jwtPrivateKey'));
    return token;
}

export const Gamer = mongoose.model('Gamer', gamerSchema);


export function validateSignup(object) {
    const schema = Joi.object({
        userName: Joi.string().min(4).required(),
        codeNums: Joi.number().min(1).max(100).required()
    });

    return schema.validate(object).error;
}

export function validateLogin(object) {
    const schema = Joi.object({
        userName: Joi.string().min(4).required(),
        code: Joi.string().length(8).pattern(/^[A-Z0-9]+$/).required()
    });

    return schema.validate(object).error;
}