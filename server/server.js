const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');

app.use(express.static('assets'));
app.use(express.json());

const path = require('path')
app.use(express.static(path.join(__dirname, '../build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
});

app.get('/getConfig', (req, res) => {
    const config = fs.readFileSync(__dirname + '/../src/config/config.json');
    res.send(config);
});

app.post('/updateConfig', (req, res) => {
    const config = req.body;
    fs.writeFileSync(__dirname + '/../src/config/config.json', JSON.stringify(config));
    res.send({ ok: true, config: config })
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../assets/icons/');
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
    console.log(req.body.imageName);
    res.send({ ok: true })
});

const PORT = 9078;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);