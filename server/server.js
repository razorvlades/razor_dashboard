const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');

app.use(express.static('assets'));
app.use(express.json());

const dir = __dirname + '/'

const path = require('path')
app.use(express.static(path.join(dir, '../build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(dir, '../build', 'index.html'))
});

app.get('/getIcons', (req, res) => {
    if (!fs.existsSync(dir + '../config/icons.json')) {
        fs.copyFileSync(dir + '../defaults/default_icons.json', dir + '../config/icons.json');
    }

    const icons = fs.readFileSync(dir + '../config/icons.json');
    res.send(icons);
});

app.get('/getConfig', (req, res) => {
    if (!fs.existsSync(dir + '../config/config.json')) {
        fs.copyFileSync(dir + '../defaults/default_config.json', dir + '../config/config.json');
    }
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
        cb(null, dir + '../assets/icons/');
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

const PORT = 9078;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);