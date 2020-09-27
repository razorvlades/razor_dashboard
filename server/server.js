require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const fs_extra = require('fs-extra')
const multer = require('multer');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const api_router = require('./routers/api');
const UserDetails = require('./models/UserDetails');

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

const init_config = async () => {
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
    
    if (!fs.existsSync(dir + '../config/apps.json')) {
        fs.copyFileSync(dir + '../defaults/default_apps.json', dir + '../config/apps.json');
    }
    
    const oldFile = fs.readFileSync(dir + '../defaults/default_icons.json');
    const newFile = fs.readFileSync(dir + '../config/icons.json');
    
    if (!oldFile.equals(newFile)) {
        fs.copyFileSync(dir + '../defaults/default_icons.json', dir + '../config/icons.json');
        fs_extra.copy(dir + '../defaults/assets/icons', dir + '../config/assets/icons');
    }
    
    const oldFile1 = fs.readFileSync(dir + '../defaults/default_apps.json');
    const newFile1 = fs.readFileSync(dir + '../config/apps.json');
    
    if (!oldFile1.equals(newFile1)) {
        fs.copyFileSync(dir + '../defaults/default_apps.json', dir + '../config/apps.json');
    }
}

init_config();

app.use(express.static('config/assets'));
app.use(express.static(path.join(dir, '../build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api_router);

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

const content_routes = ['/', '/editapps', '/settings', '/login', '/register'];

app.get(content_routes, (req, res) => {
    res.sendFile(path.join(dir, '../build', 'index.html'));
});

app.get('/getIcons', (req, res) => {
    const icons = fs.readFileSync(dir + '../config/icons.json');
    res.send(icons);
});

app.get('/getApps', (req, res) => {
    const apps = JSON.parse(fs.readFileSync(dir + '../config/apps.json')).apps;
    const sorted_apps = apps.sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    res.send({ apps: sorted_apps });
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
        if (err) {
            return next(err);
        }
    
        if (!user) {
            res.send({ loggedIn: false });
            return next();
        }

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

    UserDetails.register( new UserDetails({ username: username, active: false }), password, (err, account) => {
        if (err)
            return res.send({ registered: false });
        else
            return res.send({ registered: true });
    });
});

app.get('/user', (req, res, next) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});

app.get('/users', (req, res, next) => {
    const query = UserDetails.find({});
    query.exec((err, users) => {
        res.send({ users });
    })
});

app.get('/user/delete', (req, res, next) => {
    const username = req.query.username;
    UserDetails.findOneAndDelete({ username: username }, {}, (err, doc) => {
        if (err)
            return res.send({ ok: false });
        return res.send({ ok: true });
    });
});

app.post('/user/update', async (req, res, next) => {
    const user = req.body.user;
    const new_password = user.password;
    const new_username = user.username;
    const current_username = user.current_username;

    UserDetails.findOne({ username: current_username }, async (err, doc) => {
        if (err) {
            res.send({ ok: false });
        }
        if (new_password) {
            const user_obj = new UserDetails(doc);
            await user_obj.setPassword(new_password);
            await user_obj.save();
        }
        if (new_username) {
            UserDetails.findOneAndUpdate({ username: current_username }, { $set: { username: new_username } }, {}, (err, doc) => {
                if (err) {
                    res.send({ ok: false });
                }
                return res.send({ ok: true });
            });
        }
        else {
            res.send({ ok: true });
        }
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);