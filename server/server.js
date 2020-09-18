const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const ImageRouter = express.Router();

app.use(express.static('assets'));
app.use(express.json());

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
        cb(null, file.originalname);
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
    console.log(req.body);
    res.send({ ok: true })
});

app.listen(9078);