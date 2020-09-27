const express = require('express');
const router = express.Router();
const multer = require('multer');

const dir = __dirname + '/';

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const background_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir + '../../config/assets/background/');
    },
    filename: (req, file, cb) => {
        cb(null, 'background.png');
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

const background_upload = multer({
    storage: background_storage,
    fileFilter: fileFilter
});
    
router.post("/upload-background", background_upload.single('imageData'), (req, res, next) => {
    console.log('here')
    res.send({ ok: true })
});

module.exports = router;