const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const UserDetail = new Schema({
  username: String,
  password: String
});

UserDetail.plugin(passportLocalMongoose, { usernameLowerCase: true });
const UserDetails = mongoose.model('user', UserDetail, 'user');

module.exports = UserDetails;