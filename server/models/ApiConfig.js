const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ApiConfigSchema = new Schema({
    id: String,
    api_url: String,
    api_key: {
        iv: String,
        content: String
    },
    api_username: String,
    api_password: {
        iv: String,
        content: String
    }
});

const ApiConfigModel = mongoose.model('ApiConfig', ApiConfigSchema );

module.exports = ApiConfigModel;