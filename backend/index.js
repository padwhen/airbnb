const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')


require('dotenv').config()
app.use(cors({
    credentials: true,
    origin: 'http://192.168.0.102:3000',
}));
app.use(express.json());
app.use(cookieParser());

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'jfbnasjfbasjbfjasbfj'; //random string



mongoose.connect(process.env.MONGO_URL)
// console.log(process.env.MONGO_URL)
app.get('/test', (request, response) => {
    response.json('Test ok')
});

app.post('/register', async (request, response) => {
    const { name, email, password} = request.body
    try {
        const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    })
    response.json(userDoc);
    } catch (exception) {
        response.status(422).json(exception)
    }
})
app.post('/login', async (request, response) => {
    const {email, password} = request.body;
    const userDoc = await User.findOne({email})
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
            jwt.sign({
                email: userDoc.email, id:userDoc._id}, 
                jwtSecret, {}, 
                (error, token) => {
                if (error) throw error;
                response.cookie('token',token).json(userDoc)
                })
        } else {
            response.status(422).json('password not ok')
        }
    } else {
        response.json('not found')
    }
})

app.get('/profile', (request, response) => {
    const {token} = request.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (error, user) => {
            if (error) throw error;
            response.json(user)
        })
    } else {
        response.json("error")
    }
})

// Srq68bjXxR2wcPC5
const PORT = 4000;
app.listen(PORT, function() {
    console.log(`${PORT}`)
});