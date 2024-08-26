import express from 'express';
import config from 'config';
import cors from 'cors';
import { Gamer, validateLogin, validateSignup } from './models/gamer.mjs';
import { connectToDatabase, generateRandomCode, handleExceptions } from './utility.mjs';
import { exception }  from './middlewares/exception.mjs';
import { limiter } from './middlewares/limitLogin.mjs';

handleExceptions();
connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = config.get('PORT');

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT} ...`);
});

app.use('/api/health-check', (req, res) => {
    res.status(200).send('Server listening');
});

app.use('/api/generate-game-codes', async(req, res) => {
    const {name, nums} = req.body;
    const error = validateSignup({userName: name, codeNums: nums})

    if(error) return res.status(400).send(error.details[0].message);

    let gamer = await Gamer.findOne({userName: name});
    if(gamer) return res.status(400).send({ message: 'Username already exist'});
    
    

    const gameCodes = [];
    for (let i = 0; i < nums; i++) {
        gameCodes.push(generateRandomCode());
    }
    gamer = new Gamer({
        userName: name,
        gameCodes
    })
    const result = await gamer.save();

    if(result) return res.status(201).send({ message: 'Codes generated', gameCodes});
    else return res.status(500).send({ message: 'Internal db error' })
});

app.use('/api/login', limiter, async (req, res) => {
    const { name, code } = req.body;

    const error = validateLogin({ userName: name, code: code });
    if (error) return res.status(400).send({ message: error.details[0].message });

    const gamer = await Gamer.findOne({ userName: name });
    if (!gamer) return res.status(404).send({ message: 'User not found' });

    const match = gamer.gameCodes.find(item => item === code);
    
    if (match) {
        const token = gamer.genrateToken();
        return res.status(200).send({ message: 'Login successful', token});
    }
    else return res.status(400).send({ message: 'Invalid game code' });

});

import { auth } from './middlewares/auth.mjs';

app.use('/api/resourses', auth, async(req, res) => {
    res.status(200).send({message: 'All resourses are yours'});
})


app.use(exception);