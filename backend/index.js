const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const imageDownloader = require('image-downloader')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const Place = require('./models/Places')


require('dotenv').config()
app.use(cors({
    credentials: true,
    origin: 'http://192.168.0.102:3000',
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads/'))

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
    console.log("Login route accessed");
    const {email, password} = request.body;
    const userDoc = await User.findOne({email})
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
            jwt.sign({
                email: userDoc.email, id:userDoc._id}, 
                jwtSecret, {}, 
                (error, token) => {
                    try {
                        if (error) throw error;
                        console.log("Token value:", token);
                        response.cookie('token',token).json(userDoc)
                    } catch (error) {
                        console.log(error)
                    }
                })
        } else {
            response.status(422).json('password not ok')
        }
    } else {
        response.json('not found')
    }
})

app.get('/profile', (request, response) => {
    const { token } = request.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (error, userData) => {
            if (error) {
                response.json("error");
            } else {
                const {name, email, _id} = await User.findById(userData.id)
                response.json({name, email, _id});
            }
        });
    } else {
        response.json("error");
    }
});


app.post('/logout', (request, response) => {
    response.cookie('token','').json(true)
})

app.post('/upload-by-link', async (request, response) => {
    const {link} = request.body;
    const newName = 'photo' + Date.now() + '.jpg'
    const destPath = path.join(__dirname, 'uploads', newName);
    await imageDownloader.image({
        url: link,
        dest: destPath
    });
    response.json(newName)
})

const photosMiddleware = multer({dest: 'uploads/'})

app.post('/uploads', photosMiddleware.array('photos',100),(request, response) => {
    const uploadFiles = [];
    for (let i=0; i < request.files.length; i++) {
        const {path, originalname} = request.files[i]
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1]
        const newPath = path + '.' + ext
        fs.renameSync(path, newPath)
        uploadFiles.push(newPath.replace('uploads\\',''))
    }
    response.json(uploadFiles)
});

app.post('/places', async (request, response) => {
    const {token} = request.cookies;
    const {title, address, addedPhotos, 
        description, perks, extraInfo, checkIn, checkOut, maxGuests} = request.body;
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
        if (error) throw error;
        const placeDoc = await Place.create({
            owner: userData.id,
            title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests
        })
        response.json(placeDoc)
    })
})

app.get('/places', (request, response) => {
    const {token} = request.cookies
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
        const {id} = userData
        response.json( await Place.find({owner: id}))
    })
    
})

app.get('/places/:id', async (request, response) => {
    const {id} = request.params
    response.json(await Place.findById(id))
})

app.put('/places', async (request, response) => {
    const {token} = request.cookies;
    const {id, title, address, addedPhotos, 
        description, perks, extraInfo, checkIn, checkOut, maxGuests} = request.body;
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
        if (error) throw error;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests
            })
            await placeDoc.save()
            response.json('ok')
        }
    })

})
// Srq68bjXxR2wcPC5
const PORT = 4000;
app.listen(PORT, function() {
    console.log(`${PORT}`)
});