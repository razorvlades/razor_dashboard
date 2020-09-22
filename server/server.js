require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const fs_extra = require('fs-extra')
const multer = require('multer');
const crypto = require('crypto');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const MongoStore = require('connect-mongo')(session);

// get current directory
const path = require('path');
const dir = __dirname + '/';

// express server settings
const PORT = process.env.PORT || 9078;
const HOST = process.env.HOST || '0.0.0.0';

// mongodb settings and connection
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_URI = "mongodb://" + DB_HOST + '/' + DB_NAME;

const CONNECTION_SETTINGS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    auth: { 
        user: DB_USER,
        password: DB_PASS
    }
}

mongoose.connect(DB_URI, CONNECTION_SETTINGS);
const Schema = mongoose.Schema;
const UserDetail = new Schema({
  username: String,
  password: String
});

UserDetail.plugin(passportLocalMongoose, { usernameLowerCase: true });
const UserDetails = mongoose.model('user', UserDetail, 'user');

if (!fs.existsSync(dir + '../config')) {
    fs.mkdirSync(dir + '../config', { recursive: true });
}

if (!fs.existsSync(dir + '../config/assets/icons') || !fs.existsSync(dir + '../config/assets/background')) {
    fs_extra.copy(dir + '../defaults/assets', dir + '../config/assets');
    console.log('assets directory created');
}

if (!fs.existsSync(dir + '../config/icons.json')) {
    fs.copyFileSync(dir + '../defaults/default_icons.json', dir + '../config/icons.json');
}

if (!fs.existsSync(dir + '../config/config.json')) {
    fs.copyFileSync(dir + '../defaults/default_config.json', dir + '../config/config.json');
}

app.use(express.static('config/assets'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(UserDetails.createStrategy());
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

app.use(express.static(path.join(dir, '../build')));

const content_routes = ['/', '/appsettings', '/settings', '/login', '/register'];

app.get(content_routes, (req, res) => {
    res.sendFile(path.join(dir, '../build', 'index.html'));
});

app.get('/getIcons', (req, res) => {
    const icons = fs.readFileSync(dir + '../config/icons.json');
    res.send(icons);
});

app.get('/getConfig', (req, res) => {
    const config = fs.readFileSync(dir + '../config/config.json');
    res.send(config);
});

app.post('/updateConfig', (req, res) => {
    const config = req.body;
    fs.writeFileSync(dir + '../config/config.json', JSON.stringify(config));
    res.send({ ok: true, config: config })
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir + '../config/assets/icons/');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.imageName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb (null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
    
app.post("/upload-image", upload.single('imageData'), (req, res, next) => {
    res.send({ ok: true })
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
        console.log(user);
        if (err) {
            return next(err);
        }
    
        if (!user) {
            res.send({ loggedIn: false });
            return next();
        }

        console.log("remember me: ", req.body.remember_me);
        if (req.body.remember_me) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        }
        else {
            req.session.cookie.expires = false;
        }

        req.logIn(user, (err) => {
            if (err) {
                res.send({ loggedIn: false });
                return next(err);
            }
            res.send({ loggedIn: true });
            return next();
        });
        
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.send({ loggedIn: false });
});

app.post('/create_user', async (req, res) => {

    const {
        username, 
        password
    } = req.body;

    console.log(req.body);

    UserDetails.register({ username: username, active: false }, password, (err, account) => {
        if (err)
            return res.send({ registered: false });
        else
            return res.send({ registered: true });
    });
});

app.get('/user', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);