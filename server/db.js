const mongoose = require('mongoose');

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

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;