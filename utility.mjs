import 'express-async-errors';
import mongoose from 'mongoose';
import config from 'config';

export function connectToDatabase() {
    const url =  config.get('db') || 'mongodb://localhost/ve-apis'
    
    mongoose.connect(url)
        .then(() => {
            console.log(`Connected to ${url}`);
        })
        .catch((error) => {
            console.log(`Failed to connect to the database. Error: ${error.message}`);
        });
}

export function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}


export function handleExceptions() {

    process.on('uncaughtException', (ex) => {
        console.log(ex.message);
        process.exit(1);
    });

    process.on('unhandledRejection', (ex) => {
        if (ex) {
            console.log(ex.message);
        } else {
            console.log('Unhandled Rejection: ' + ex);
        }
        process.exit(1);
    });
}