require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const fs_extra = require('fs-extra')
const multer = require('multer');
const crypto = require('crypto');
const { MongoClient } = require("mongodb");

// get current directory
const path = require('path');
const dir = __dirname + '/';

// express server settings
const PORT = proces.env.PORT || 9078;
const HOST = proces.env.HOST || '0.0.0.0';

// mongodb settings and connection
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_URI = "mongodb://" + DB_USER + ':' + DB_PASS + "@" + DB_HOST;
const DB_OPTIONS = {
    useUnifiedTopology: true
}
const client = new MongoClient(DB_URI, DB_OPTIONS);

async function connect_db() {
    await client.connect();
    await client.db(DB_NAME).command({ ping: 1 });
    console.log("Connected successfully to server");
}
connect_db();

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

app.use(express.static(path.join(dir, '../build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(dir, '../build', 'index.html'))
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

app.post("/login", async (req, res) => {
    console.log("/login POST request received");

    let rc = await user_login({
        username: req.body.username,
        password: req.body.password
    });

    return res.status(rc.status).json({ message: rc.message, user: rc.user });
});

app.post('/create_user', async (req, res) => {
    console.log("/create_user POST request received");
    
    let rc = await create_user({
        username: req.body.username,
        password: req.body.password,
        image: ''
    });

    return res.status(rc.status).json({ message: rc.message, user: rc.user });
});

async function user_login(user) {
    if (!user) {
      return { status: 400, message: "Must specify a user"};
    }
    if (!user.username || !user.password)
      return { status: 400, message: "No username or password specified"};

    let db = client.db(DB_NAME);
  
    let result = await db.collection("users").findOne({ username: user.username }, {});
  
    if (!result)
      return { status: 404, message: "User does not exist", user: user};
    
    if (!checkPass(user.password, result.password))
      return { status: 401, message: "Incorrect password", user: user};
  
    delete result.password;
    
    return { status: 200, message: "User authenticated successfully", user: result};
}

async function create_user(user) {
    if (!user) {
      return { status: 400, message: "Must specify a user"};
    }
    if (!user.password || !user.username)
        return { status: 400, message: "Username and/or password is empty" };

    let db = client.db(DB_NAME);

    let result = await db.collection('users').findOne({username: user.username});
    if (result)
      return { status: 409, message: "Username already taken" };

    user.password = encryptPass(user.password);

    result = await db.collection('users').insertOne(user);

    if (!result)
      return { status: 500, message: "Error adding user to database" };

    let user_result = result.ops[0];
    delete user_result.password;

    return { status: 200, message: "User successfully created", user: user_result };
}

function encryptPass(password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
    password = salt + "$" + hash;
    return password;
}

function checkPass(user_pass, password) {
    let passwordFields = password.split('$');
    let salt = passwordFields[0];
    let hash = crypto.createHmac('sha512', salt).update(user_pass).digest("base64");
    if (hash === passwordFields[1])
      return true;
    return false;
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);