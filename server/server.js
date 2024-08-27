import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import basicAuth from 'basic-auth';

// Initialize environment variables from .env file
dotenv.config();

const app = express();


app.use(express.json());


app.use(cors({

}));

const authMiddleware = (req, res, next) => {
    const user = basicAuth(req);
    console.log(user);


    if (user && user.name === 'admin' && user.pass === 'password') {
        return next();
    } else {
        return res.status(401).send('Authentication required.');
    }
};

// Custom morgan format with timestamp
const customFormat = (tokens, req, res) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} ${tokens['response-time'](req, res)} ms`;
};

app.use(morgan(customFormat));

const user = {
    username: "gor__m__yan",
    password: "$2b$10$vRw496YdSKSmAn3wnFc6seIRCG.x9xEHNTgA.diia/IiIYStXzHcW",
    bio: "Ես մեծ հետաքրքրություն ունեմ տեխնոլոգիաների հանդեպ, և սիրում եմ փորձարկել նոր սարքեր ու ծրագրեր: Ազատ ժամանակս հիմնականում անցկացնում եմ ֆուտբոլ դիտելով կամ ընկերներիս հետ խաղալով ։ Սիրածս ֆուտբոլի թիմը PSG-ն է: Գիտակցելով ժամանակակից աշխարհի կարևորությունը, նաև փորձում եմ սովորել նոր լեզուներ՝ թե՛ ծրագրավորման, թե՛ մարդկային։ Դե իհարկե, շաբաթը մի քանի անգամ վազքով եմ զբաղվում՝ առողջությունս պահպանելու համար։",
    age: 32,
    image: "https://media.istockphoto.com/id/880486494/photo/smiling-businessman-using-laptop.jpg?s=612x612&w=0&k=20&c=jNCdH9BlNovO74PeVmSJxVW3SsTktEPK8b4JygmfdqY=",
    get() {
        const customUser = {};

        const unSelect = ["get", "password"];

        for (let key in this) {
            if (this.hasOwnProperty(key) && !unSelect.includes(key)) {
                customUser[key] = this[key];
            }
        }

        return customUser;
    }
};

app.post('/login', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === user.username && await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign(user.get(), "angushakeligaxnabar", { expiresIn: '1h' });
            res.send({ access_token: accessToken });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).send({ message: 'Internal server error' });
});

app.listen(3001, () => {
    console.log("Server listening on port http://localhost:3001");
});
